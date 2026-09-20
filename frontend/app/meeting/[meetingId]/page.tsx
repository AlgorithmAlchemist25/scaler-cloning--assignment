"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getMeeting, joinMeeting } from "../../../lib/api";
import { Meeting } from "../../../lib/types";
import CallRoom from "../../../components/meeting/CallRoom";
import JoinScreen from "@/components/meeting/JoinScreen";

export default function MeetingRoom() {
  const params = useParams();
  const router = useRouter();

  const meetingId = params.meetingId as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  // Actual camera/microphone stream
  const [cameraStream, setCameraStream] =
    useState<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState("");


  /*
   * Load meeting details when the page opens.
   */
  useEffect(() => {
    const loadMeeting = async () => {
      try {
        const data = await getMeeting(meetingId);

        setMeeting(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Meeting not found."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [meetingId]);


  /*
   * Stop camera and microphone when the component
   * is removed from the page.
   */
  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [cameraStream]);


  /*
   * Join the meeting and request access to the
   * user's camera and microphone.
   */
  const handleJoin = async () => {
    if (!displayName.trim()) {
      setError("Please enter your display name.");
      return;
    }

    try {
      setJoining(true);
      setError("");
      setCameraError("");

      await joinMeeting(
        meetingId,
        displayName.trim()
      );

      setJoined(true);

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        setCameraStream(stream);
      } catch (err) {
        console.error(
          "Camera/microphone access failed:",
          err
        );

        /*
         * Camera access is not required to remain
         * in the meeting, so we allow the user to
         * continue with their avatar.
         */
        setCameraError(
          "Camera or microphone access was denied. You can still join the meeting."
        );
      }

    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to join meeting."
      );
    } finally {
      setJoining(false);
    }
  };


  /*
   * Toggle microphone.
   *
   * MediaStream audio tracks have an `enabled`
   * property. Setting it to false disables the
   * microphone without destroying the stream.
   */
  const handleToggleMuted = () => {
    const newMuted = !muted;

    if (cameraStream) {
      cameraStream
        .getAudioTracks()
        .forEach((track) => {
          track.enabled = !newMuted;
        });
    }

    setMuted(newMuted);
  };


  /*
   * Toggle camera.
   *
   * We enable/disable the existing video track
   * instead of requesting camera access again.
   */
  const handleToggleVideo = () => {
    const newVideoOff = !videoOff;

    if (cameraStream) {
      cameraStream
        .getVideoTracks()
        .forEach((track) => {
          track.enabled = !newVideoOff;
        });
    }

    setVideoOff(newVideoOff);
  };


  /*
   * Leave meeting.
   *
   * Stop all camera/microphone tracks before
   * navigating back to the dashboard.
   */
  const handleLeave = () => {
    cameraStream?.getTracks().forEach((track) => {
      track.stop();
    });

    setCameraStream(null);

    router.push("/");
  };


  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <p className="text-slate-500">
          Loading meeting...
        </p>
      </main>
    );
  }


  /*
   * Meeting doesn't exist.
   */
  if (!meeting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
            !
          </div>

          <h1 className="mt-5 text-xl font-semibold text-slate-900">
            Meeting not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This meeting may not exist or the meeting ID may be
            invalid.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-[#2D8CFF] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to dashboard
          </button>

        </div>
      </main>
    );
  }


  /*
   * Join screen.
   */
  if (!joined) {
  return (
    <JoinScreen
      meetingTitle={meeting.title}
      displayName={displayName}
      onDisplayNameChange={setDisplayName}
      joining={joining}
      error={error}
      onJoin={handleJoin}
      onCancel={() => router.push("/")}
    />
  );
}


  /*
   * Actual meeting room.
   *
   * CallRoom receives the MediaStream and is
   * responsible for displaying the video.
   */
  return (
    <CallRoom
      meetingTitle={meeting.title}
      meetingId={meetingId}
      displayName={displayName}
      muted={muted}
      videoOff={videoOff}
      cameraStream={cameraStream}
      cameraError={cameraError}
      onToggleMuted={handleToggleMuted}
      onToggleVideo={handleToggleVideo}
      onLeave={handleLeave}
    />
  );
}