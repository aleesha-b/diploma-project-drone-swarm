from drone import TelloDrone
from djitellopy import Tello
from djitellopy import swarm


class DroneControl:
    def __init__(self):
        self.drone_swarm_ips = []
        # self.swarm = swarm.TelloSwarm()
        self.drone = TelloDrone()

    def get_video_feed(self):
        return None

    def send_command(self, command, distance):
        match command:
            case "takeoff":
                self.drone.takeoff()
                return "Taking off"
            case "land":
                self.drone.land()
                return "Landing"
            case "forward":
                # drone.move_forward(distance)
                return "Moving forward by" + distance + "cm"
            case "back":
                # drone.move_back(distance)
                return "Moving back by" + distance + "cm"
            case "left":
                # drone.move_left(distance)
                return "Moving left by", distance, "cm"
            case "right":
                # drone.move_right(distance)
                return "Moving right by", distance, "cm"
            case "rotate-clockwise":
                # drone.rotate_clockwise(30)
                return "Rotating clockwise"
            case"rotate-anticlockwise":
                # drone.rotate_counter_clockwise(30)
                return "Rotating clockwise"

    def setup_drones(self, ip_addresses):
        self.drones = ip_addresses
        # self.swarm.fromIps(self.drone_swarm_ips)
