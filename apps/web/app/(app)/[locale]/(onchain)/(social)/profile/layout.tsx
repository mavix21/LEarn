import * as React from "react";
import {
  Badge,
  Calendar,
  Edit2,
  FileText,
  Globe,
  Mail,
  Users,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@skill-based/ui/components/avatar";
import { Button } from "@skill-based/ui/components/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <div className="col-start-1 row-start-2 mx-auto hidden max-w-xs lg:block"></div>

      <div className="col-span-1 col-start-1 h-full overflow-y-hidden border-x lg:col-start-2">
        {children}
      </div>

      {/* Sidebar */}
      <div className="bg-muted col-start-3 row-start-2 hidden h-full overflow-y-auto p-2 lg:block">
        <div className="mx-auto max-w-xs">
          {/* Manager Section */}
          <div className="mb-6 rounded-lg border bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold">My Manager</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar className="mr-3 h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Roy Strata"
                  />
                  <AvatarFallback>RS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Roy Strata</h3>
                  <p className="text-sm text-gray-500">
                    Chief Executive Officer
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Avatar className="mr-3 h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="James Botosh"
                  />
                  <AvatarFallback>JB</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">James Botosh</h3>
                  <p className="text-sm text-gray-500">
                    Chief Operating Officer
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Avatar className="mr-3 h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Assaf Rappaport"
                  />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Assaf Rappaport</h3>
                  <p className="text-sm text-gray-500">
                    VP of Customer Operations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="rounded-lg border bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Additional Details</h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-green-600 hover:text-green-700"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <h3 className="mb-2 text-xs uppercase text-gray-500">EMAIL</h3>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  <a
                    href="mailto:assaf@coolcompany.com"
                    className="text-green-600 hover:underline"
                  >
                    assaf@coolcompany.com
                  </a>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="mb-2 text-xs uppercase text-gray-500">
                  LANGUAGES
                </h3>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-gray-500" />
                  <span>English, Spanish</span>
                </div>
              </div>

              {/* Preferred Gender Pronouns */}
              <div>
                <h3 className="mb-2 text-xs uppercase text-gray-500">
                  PREFERRED GENDER PRONOUNS
                </h3>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span>He / Him / His</span>
                </div>
              </div>

              {/* Nickname */}
              <div>
                <h3 className="mb-2 text-xs uppercase text-gray-500">
                  NICKNAME
                </h3>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Costa</span>
                </div>
              </div>

              {/* Joined */}
              <div>
                <h3 className="mb-2 text-xs uppercase text-gray-500">JOINED</h3>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span>2 months ago, on 12/15/2020</span>
                </div>
              </div>

              {/* Social Sections */}
              <div>
                <h3 className="mb-2 text-xs uppercase text-gray-500">
                  SOCIAL SECTIONS
                </h3>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-gray-500" />
                  <div className="space-x-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Pinterest
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Snap Inc
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Pinterest
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="mb-2 text-xs uppercase text-gray-500">
                  EDUCATION
                </h3>
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  <a href="#" className="text-green-600 hover:underline">
                    Stanford University
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
