import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@skill-based/ui/components/avatar";

export default function Connections() {
  return (
    <div className="bg-card mb-6 rounded-xl border p-4">
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
            <p className="text-muted-foreground text-sm">
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
            <p className="text-muted-foreground text-sm">
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
            <p className="text-muted-foreground text-sm">
              VP of Customer Operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
