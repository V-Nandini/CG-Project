import { useEffect, useState } from "react";

export const useControls = (vehicleApi, chassisApi) => {
  let [controls, setControls] = useState({ });

  useEffect(() => {
    const keyDownPressHandler = (e) => {
      setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: true }));
    }

    const keyUpPressHandler = (e) => {
      setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: false }));
    }
  
    window.addEventListener("keydown", keyDownPressHandler);
    window.addEventListener("keyup", keyUpPressHandler);
    return () => {
      window.removeEventListener("keydown", keyDownPressHandler);
      window.removeEventListener("keyup", keyUpPressHandler);
    }
  }, []);

  useEffect(() => {
    if(!vehicleApi || !chassisApi) return;

    const forwardEngineForce = 150; // Increased engine force for forward movement
    const reverseEngineForce = 100; // Increased engine force for reverse movement
    const steeringValue = 0.5; // Increased steering sensitivity for sharper turns
    const impulseMagnitude = 1.5; // Reduced impulse magnitude for smoother and slower flips

    if (controls.w) {
      if (controls.s) {
        vehicleApi.applyEngineForce(0, 2);
        vehicleApi.applyEngineForce(0, 3);
      } else {
        vehicleApi.applyEngineForce(forwardEngineForce, 2);
        vehicleApi.applyEngineForce(forwardEngineForce, 3);
      }
    } else if (controls.s) {
      vehicleApi.applyEngineForce(-reverseEngineForce, 2);
      vehicleApi.applyEngineForce(-reverseEngineForce, 3);
    } else {
      vehicleApi.applyEngineForce(0, 2);
      vehicleApi.applyEngineForce(0, 3);
    }

    if (controls.a) {
      vehicleApi.setSteeringValue(steeringValue, 2);
      vehicleApi.setSteeringValue(steeringValue, 3);
    } else if (controls.d) {
      vehicleApi.setSteeringValue(-steeringValue, 2);
      vehicleApi.setSteeringValue(-steeringValue, 3);
    } else {
      for(let i = 2; i < 4; i++) {
        vehicleApi.setSteeringValue(0, i);
      }
    }

    if (controls.arrowdown)  chassisApi.applyLocalImpulse([0, -impulseMagnitude, 0], [0, 0, +1]);
    if (controls.arrowup)    chassisApi.applyLocalImpulse([0, -impulseMagnitude, 0], [0, 0, -1]);
    if (controls.arrowleft)  chassisApi.applyLocalImpulse([0, -impulseMagnitude, 0], [-0.5, 0, 0]);
    if (controls.arrowright) chassisApi.applyLocalImpulse([0, -impulseMagnitude, 0], [+0.5, 0, 0]);

    if (controls.r) {
      chassisApi.position.set(-1.5, 0.5, 3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }
  }, [controls, vehicleApi, chassisApi]);

  return controls;
}
