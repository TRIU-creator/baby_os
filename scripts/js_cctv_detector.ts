import * as tf from "@tensorflow/tfjs-node";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { detectRunner, BoundingBox } from "../modules/skills/vision/cctv_cv_engine";

export async function detectHumanVelocity(previous: BoundingBox, current: BoundingBox) {
  const model = await cocoSsd.load();
  const dummy = tf.zeros([1, 300, 300, 3]);
  await model.detect(dummy as any);
  dummy.dispose();
  const alert = detectRunner(previous, current);
  if (alert) {
    await fetch("http://localhost:7071/api/security/alert", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(alert)
    }).catch(() => undefined);
  }
  return alert;
}
