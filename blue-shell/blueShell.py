if __name__ == "__main__":
    import copy
    import datetime
    import os
    import time

    from constants import course_ids, course_index, karts
    from dotenv import load_dotenv
    from memoryLib import Dolphin
    from pick import pick

    from pocketbase import PocketBase

    players = ["Ben", "Chris", "Derek", "Ryan"]
    p1, index = pick(players, "p1 name:")
    players.remove(p1)
    p2, index = pick(players, "p2 name:")
    players.remove(p2)
    p3, index = pick(players, "p3 name:")
    players.remove(p3)
    p4 = players[0]
    
    p1_kart, index = pick(karts, "p1 kart:")
    p3_kart, index = pick(karts, "p3 kart:")
    
    print(p1, p2, p1_kart, "\n", p3, p4, p3_kart, "\n")

    dolphin = Dolphin()
    print("Searching for Dolphin")
    while not dolphin.find_dolphin():
        time.sleep(5)
    print("Found Dolphin!")

    print("Searching for MEM1/MEM2")
    while not dolphin.init_shared_memory():
        time.sleep(5)
    print("Found MEM1/MEM2!")

    load_dotenv()
    client = PocketBase(os.getenv("POCKETBASE_URL"))
    client.admins.auth_with_password(os.getenv("POCKETBASE_EMAIL"), os.getenv("POCKETBASE_PASSWORD"))
    live_record = client.collection("Live").create(
        {
            "topScreen": {"driver": p1, "items": p2, "kart": p1_kart},
            "bottomScreen": {"driver": p3, "items": p4, "kart": p3_kart},
            "topScreenTimes": [],
            "bottomScreenTimes": [],
            "topScreenPoints": 0,
            "bottomScreenCode": 0,
            "trackOrder": [],
        }
    )

    # these values may be different for you
    # p1_timer_address = 0x810BC400
    # p3_timer_address = 0x810CDB90
    p1_timer_address = 0x810A33F0
    p3_timer_address = 0x810B4B80
    current_track_address = 0x803CB6A8

    num_tracks = 2  # 4 for single cup
    track_order = []
    times1 = copy.deepcopy(course_index)
    times2 = copy.deepcopy(course_index)

    # wait for first track to start
    RACE_STARTED = 5999999
    while dolphin.read_uint32(p1_timer_address) != RACE_STARTED:# and dolphin.read_uint32(p3_timer_address) != RACE_STARTED:
        time.sleep(1)

    print("Grand Prix started")
    track = dolphin.read_uint32(current_track_address)
    track_order.append(course_ids[track])
    live_record = client.collection("Live").update(
        live_record.id,
        { "trackOrder": track_order }
    )
    while len(track_order) <= num_tracks:
        if dolphin.read_uint32(p1_timer_address) != RACE_STARTED:# and dolphin.read_uint32(p3_timer_address) != RACE_STARTED:
            p1_time = dolphin.read_uint32(p1_timer_address)
            p3_time = dolphin.read_uint32(p3_timer_address)
            times1[course_ids[track]] = p1_time
            times2[course_ids[track]] = p3_time
            print(times1)
            print(times2)

            top = live_record.top_screen_times
            top.append(p1_time)
            bottom = live_record.bottom_screen_times
            bottom.append(p3_time)
            live_record = client.collection("Live").update(
                live_record.id,
                {
                    "topScreenTimes": live_record.top_screen_times,
                    "bottomScreenTimes": live_record.bottom_screen_times,
                }
            )
            if len(track_order) == num_tracks:
                break
            else:
                while dolphin.read_uint32(current_track_address) == track:
                    time.sleep(5)
                track = dolphin.read_uint32(current_track_address)
                track_order.append(course_ids[track])
                
                live_record = client.collection("Live").update(
                    live_record.id,
                    { "trackOrder": track_order }
                )

                print("Next Track: " + course_ids[track])
        time.sleep(1)

    print('track order')
    print('["' + '", "'.join(track_order) + '"]')
    print('p1 times')
    print(','.join(times1))
    print('p3 times')
    print(','.join(times2))

    p3_points = input("p3 points: ")
    p1_points = input("p1 points: ")

    latest = client.collection("Runbacks").get_full_list(query_params={
        "sort": "-episode",
    })[0]

    client.collection("Runbacks").create(
        {
            "episode": latest.episode + 1,
            "season": latest.season,
            "date": datetime.datetime.utcnow().isoformat(),
            "trackOrder": track_order,
            "topScreen": {
                "driver": p1,
                "items": p2,
                "kart": p1_kart,
                "points": p1_points,
                "time": sum(live_record.top_screen_times),
                "times": times1,
            },
            "bottomScreen": {
                "driver": p3,
                "items": p4,
                "kart": p3_kart,
                "points": p3_points,
                "time": sum(live_record.bottom_screen_times),
                "times": times2,
            },
        }
    )

    input("Press enter to Exit")
    client.collection("Live").delete(live_record.id)
