from drone import TelloDrone
from djitellopy import Tello
from djitellopy import swarm


class DroneControl:
    def __init__(self):
        self.drone_swarm_ips = []
        # self.swarm = swarm.TelloSwarm()
        self.drone = TelloDrone()
        self.predator = False

    def send_command(self, command, distance):
        match command:
            case "takeoff":
                self.drone.takeoff()
                return "Taking off"
            case "land":
                self.drone.land()
                return "Landing"
            case "forward":
                # self.drone.move_forward(distance)
                return "Moving forward by " + distance + " cm"
            case "back":
                # self.drone.move_back(distance)
                return "Moving back by " + distance + " cm"
            case "left":
                # self.drone.move_left(distance)
                return "Moving left by " + distance + " cm"
            case "right":
                # self.drone.move_right(distance)
                return "Moving right by " + distance + " cm"
            case "clockwise":
                # self.drone.rotate_clockwise(30)
                return "Rotating clockwise"
            case"counterclockwise":
                # self.drone.rotate_counter_clockwise(30)
                return "Rotating counter clockwise"

    def predator_alert(self):
        if self.predator:
            self.predator = False
        else:
            self.predator = True
        return self.predator
