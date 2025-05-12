import React from "react";
import Image from "next/image";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";

export default function UpcomingEvents() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 text-blue-600 hover:text-blue-700"
          >
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="overflow-hidden rounded-lg border">
          <div className="relative h-32 bg-pink-100">
            <Image
              src="/placeholder.svg?height=128&width=300"
              alt="Event thumbnail"
              width={300}
              height={128}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-2 top-2 min-w-[40px] rounded-lg bg-white p-1 text-center">
              <div className="text-lg font-bold">12</div>
              <div className="text-xs text-gray-500">FEB</div>
            </div>
          </div>
          <div className="p-3">
            <div className="mb-1 text-xs text-gray-500">Group Name</div>
            <h3 className="mb-1 text-sm font-medium">
              Cirrus Lunch & Learn: Robinhood Crypto vs. COO 3rd Headline Here
            </h3>
            <p className="mt-2 text-xs text-gray-500">2:30 PM PST</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="relative h-32 bg-purple-100">
            <Image
              src="/placeholder.svg?height=128&width=300"
              alt="Event thumbnail"
              width={300}
              height={128}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-2 top-2 min-w-[40px] rounded-lg bg-white p-1 text-center">
              <div className="text-lg font-bold">27</div>
              <div className="text-xs text-gray-500">FEB</div>
            </div>
          </div>
          <div className="p-3">
            <div className="mb-1 text-xs text-gray-500">Group Name</div>
            <h3 className="mb-1 text-sm font-medium">Show & Tell</h3>
            <p className="mt-2 text-xs text-gray-500">2:30 PM PST</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="relative h-32 bg-green-100">
            <Image
              src="/placeholder.svg?height=128&width=300"
              alt="Event thumbnail"
              width={300}
              height={128}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-2 top-2 min-w-[40px] rounded-lg bg-white p-1 text-center">
              <div className="text-lg font-bold">4</div>
              <div className="text-xs text-gray-500">MAR</div>
            </div>
          </div>
          <div className="p-3">
            <div className="mb-1 text-xs text-gray-500">Group Name</div>
            <h3 className="mb-1 text-sm font-medium">
              Level 4: Asian Immigrants & Canadian Immigration Groups
            </h3>
            <p className="mt-2 text-xs text-gray-500">2:30 PM PST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
