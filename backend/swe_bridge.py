import sys
import json
import argparse
import swisseph as swe

AYANAMSHA_MAP = {
    "lahiri": swe.SIDM_LAHIRI,
    "chitrapaksha": swe.SIDM_LAHIRI,
    "raman": swe.SIDM_RAMAN,
    "kp": swe.SIDM_KRISHNAMURTI,
}

def normalize_name(value):
    return str(value or "").strip().lower().replace(" ", "_").replace("-", "_")

def set_ayanamsha(name):
    key = normalize_name(name)
    swe.set_sid_mode(AYANAMSHA_MAP.get(key, swe.SIDM_LAHIRI))


def calculate_exact_positions(year, month, day, hour, lat, lon, ayanamsha="Lahiri", node="True Node"):
    try:
        set_ayanamsha(ayanamsha)
        jd_ut = swe.julday(year, month, day, hour)
        flag = swe.FLG_SIDEREAL | swe.FLG_SWIEPH

        node_key = normalize_name(node)
        node_id = swe.MEAN_NODE if "mean" in node_key else swe.TRUE_NODE

        planet_map = {
            "Sun": swe.SUN,
            "Moon": swe.MOON,
            "Mercury": swe.MERCURY,
            "Venus": swe.VENUS,
            "Mars": swe.MARS,
            "Jupiter": swe.JUPITER,
            "Saturn": swe.SATURN,
            "Rahu": node_id,
        }

        result = {
            "meta": {
                "ayanamsha": ayanamsha or "Lahiri",
                "node": "Mean Node" if node_id == swe.MEAN_NODE else "True Node",
                "julian_day_ut": round(jd_ut, 6),
                "house_system": "Whole Sign + Ascendant audit; Placidus cusps retained"
            },
            "planets": {},
            "ascendant": 0.0,
            "mc": 0.0,
            "cusps_placidus": [],
        }

        for name, p_id in planet_map.items():
            res = swe.calc_ut(jd_ut, p_id, flag)
            result["planets"][name] = round(res[0][0] % 360.0, 6)

        result["planets"]["Ketu"] = round((result["planets"]["Rahu"] + 180.0) % 360.0, 6)

        cusps, ascmc = swe.houses_ex(jd_ut, lat, lon, b'P', flag)
        result["ascendant"] = round(ascmc[0] % 360.0, 6)
        result["mc"] = round(ascmc[1] % 360.0, 6)
        # pyswisseph returns 12 cusps here, not a 1-indexed 13-item list.
        result["cusps_placidus"] = [round(c % 360.0, 6) for c in cusps]

        return result
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--year", type=int, required=True)
    parser.add_argument("--month", type=int, required=True)
    parser.add_argument("--day", type=int, required=True)
    parser.add_argument("--hour", type=float, required=True)
    parser.add_argument("--lat", type=float, required=True)
    parser.add_argument("--lon", type=float, required=True)
    parser.add_argument("--ayanamsha", type=str, default="Lahiri")
    parser.add_argument("--node", type=str, default="True Node")
    args = parser.parse_args()

    output = calculate_exact_positions(
        args.year, args.month, args.day, args.hour, args.lat, args.lon,
        args.ayanamsha, args.node
    )
    print(json.dumps(output, ensure_ascii=False))
