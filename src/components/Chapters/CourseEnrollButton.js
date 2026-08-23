import Button from "../Button";
import React from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { analytics } from "../../lib/analytics";
import { logEvent } from "firebase/analytics";

const CourseEnrollButton = ({ courseId, price }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (analytics) {
        logEvent(analytics, "course_enroll", { courseId, price });
      }
      let checkoutSessionData = {
        price: "price_1PSUdGDl9zzW61N76ZMkiOXh",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      };
      const isOneTime = true;
      if (isOneTime) {
        checkoutSessionData["mode"] = "payment";
      }
      const checkoutSessionRef = await addDoc(
        collection(db, `customers/${courseId}/checkout_sessions`),
        checkoutSessionData
      );
      onSnapshot(checkoutSessionRef, (snap) => {
        const { error, url } = snap.data();
        if (error) {
          // handle error
        }
        if (url) {
          window.location.assign(url);
        }
      });
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      className="w-full md:w-auto"
      size={"sm"}
      disabled={isLoading}
      onClick={onClick}
    >
      Enroll for {price}
    </Button>
  );
};

export default CourseEnrollButton;
