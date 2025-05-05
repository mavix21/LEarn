import { Calendar, Edit2, FileText, Globe, Mail, Users } from "lucide-react";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";

export default function AdditionalDetails() {
  return (
    <div className="bg-background rounded-xl p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Additional Details</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground hover:text-foreground p-1"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Email */}
        <div>
          <h3 className="text-muted-foreground mb-2 text-xs uppercase">
            EMAIL
          </h3>
          <div className="flex items-center">
            <Mail className="text-muted-foreground mr-2 h-4 w-4" />
            <a
              href="mailto:assaf@coolcompany.com"
              className="text-foreground hover:underline"
            >
              assaf@coolcompany.com
            </a>
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className="text-muted-foreground mb-2 text-xs uppercase">
            LANGUAGES
          </h3>
          <div className="flex items-center">
            <Globe className="text-muted-foreground mr-2 h-4 w-4" />
            <span>English, Spanish</span>
          </div>
        </div>

        {/* Preferred Gender Pronouns */}
        <div>
          <h3 className="text-muted-foreground mb-2 text-xs uppercase">
            PREFERRED GENDER PRONOUNS
          </h3>
          <div className="flex items-center">
            <Users className="text-muted-foreground mr-2 h-4 w-4" />
            <span>He / Him / His</span>
          </div>
        </div>

        {/* Nickname */}
        <div>
          <h3 className="text-muted-foreground mb-2 text-xs uppercase">
            NICKNAME
          </h3>
          <div className="flex items-center">
            <Users className="text-muted-foreground mr-2 h-4 w-4" />
            <span>Costa</span>
          </div>
        </div>

        {/* Joined */}
        <div>
          <h3 className="text-muted-foreground mb-2 text-xs uppercase">
            JOINED
          </h3>
          <div className="flex items-center">
            <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
            <span>2 months ago, on 12/15/2020</span>
          </div>
        </div>

        {/* Social Sections */}
        <div>
          <h3 className="text-muted-foreground mb-2 text-xs uppercase">
            SOCIAL SECTIONS
          </h3>
          <div className="flex items-center">
            <Globe className="text-muted-foreground mr-2 h-4 w-4" />
            <Badge className="text-primary">Pinterest</Badge>
            <Badge className="text-primary">Snap Inc</Badge>
            <Badge className="text-primary">Pinterest</Badge>
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="mb-2 text-xs uppercase text-gray-500">EDUCATION</h3>
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4 text-gray-500" />
            <a href="#" className="text-green-600 hover:underline">
              Stanford University
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
