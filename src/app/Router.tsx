/* src/app/Router.tsx */
import CameraBody from "../components/camera/CameraBody/CameraBody";

export default function Router() {
  // We have a single application surface with overlays, so we simply mount the CameraBody directly.
  return <CameraBody />;
}
