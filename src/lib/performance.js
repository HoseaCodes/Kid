import { getPerformance } from "firebase/performance";
import { app } from "./firebase";

const performance = getPerformance(app);

export { performance };