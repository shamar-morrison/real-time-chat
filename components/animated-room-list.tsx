"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedRoomCard } from "@/components/animated-room-card";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import Link from "next/link";

/**
 * Animated room list with staggered card animations
 */
export function AnimatedRoomList({
  title,
  rooms,
  isJoined = false,
  showCreateButton = false,
}: {
  title: string;
  rooms: { id: string; name: string; member_count: number }[];
  isJoined?: boolean;
  showCreateButton?: boolean;
}) {
  if (rooms.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl">{title}</h2>
        {showCreateButton && (
          <Button asChild>
            <Link href="/rooms/new">Create Room</Link>
          </Button>
        )}
      </div>
      <motion.div
        className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {rooms.map((room) => (
          <motion.div key={room.id} variants={staggerItemVariants}>
            <AnimatedRoomCard {...room} isJoined={isJoined} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
