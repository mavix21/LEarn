import { SearchPage } from "@/app/_pages/search";

export default function Page() {
  return <SearchPage />;
}

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import {
//   Briefcase,
//   Filter,
//   MapPin,
//   Search,
//   SlidersHorizontal,
//   User2,
// } from "lucide-react";

// import { Button } from "@skill-based/ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@skill-based/ui/components/card";
// import { Input } from "@skill-based/ui/components/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@skill-based/ui/components/select";

// export default function Page() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState("all");

//   // Mock data for people
//   const people = [
//     {
//       id: 1,
//       name: "Alex Johnson",
//       role: "Product Designer",
//       location: "San Francisco, CA",
//       skills: ["UI/UX", "Figma", "Prototyping"],
//       imageUrl: "/placeholder.svg?height=400&width=400",
//     },
//     {
//       id: 2,
//       name: "Sarah Williams",
//       role: "Frontend Developer",
//       location: "New York, NY",
//       skills: ["React", "TypeScript", "Tailwind CSS"],
//       imageUrl: "/placeholder.svg?height=400&width=400",
//     },
//     {
//       id: 3,
//       name: "Michael Chen",
//       role: "Full Stack Engineer",
//       location: "Seattle, WA",
//       skills: ["Node.js", "React", "MongoDB"],
//       imageUrl: "/placeholder.svg?height=400&width=400",
//     },
//     {
//       id: 4,
//       name: "Emily Rodriguez",
//       role: "UX Researcher",
//       location: "Austin, TX",
//       skills: ["User Testing", "Data Analysis", "Interviews"],
//       imageUrl: "/placeholder.svg?height=400&width=400",
//     },
//     {
//       id: 5,
//       name: "David Kim",
//       role: "Product Manager",
//       location: "Chicago, IL",
//       skills: ["Strategy", "Roadmapping", "Analytics"],
//       imageUrl: "/placeholder.svg?height=400&width=400",
//     },
//     {
//       id: 6,
//       name: "Lisa Patel",
//       role: "Backend Developer",
//       location: "Boston, MA",
//       skills: ["Python", "Django", "AWS"],
//       imageUrl: "/placeholder.svg?height=400&width=400",
//     },
//   ];

//   // Filter people based on search query
//   const filteredPeople = people.filter((person) => {
//     const matchesSearch =
//       person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       person.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       person.skills.some((skill) =>
//         skill.toLowerCase().includes(searchQuery.toLowerCase()),
//       );

//     if (filter === "all") return matchesSearch;
//     if (filter === "design")
//       return matchesSearch && person.role.toLowerCase().includes("design");
//     if (filter === "development")
//       return (
//         matchesSearch &&
//         (person.role.toLowerCase().includes("developer") ||
//           person.role.toLowerCase().includes("engineer"))
//       );
//     if (filter === "management")
//       return matchesSearch && person.role.toLowerCase().includes("manager");

//     return matchesSearch;
//   });

//   return (
//     <div className="bg-background min-h-screen">
//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-8 flex flex-col space-y-4">
//           <h1 className="text-foreground text-3xl font-bold tracking-tight">
//             Find Professionals
//           </h1>
//           <p className="text-muted-foreground">
//             Search for talented professionals across various industries and
//             roles
//           </p>
//         </div>

//         {/* Search and filters */}
//         <div className="mb-8 flex flex-col gap-4 md:flex-row">
//           <div className="relative flex-grow">
//             <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
//             <Input
//               type="text"
//               placeholder="Search by name, role, skills or location"
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="flex gap-2">
//             <Select value={filter} onValueChange={setFilter}>
//               <SelectTrigger className="w-[180px]">
//                 <div className="flex items-center gap-2">
//                   <Filter className="h-4 w-4" />
//                   <SelectValue placeholder="Filter by role" />
//                 </div>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Roles</SelectItem>
//                 <SelectItem value="design">Design</SelectItem>
//                 <SelectItem value="development">Development</SelectItem>
//                 <SelectItem value="management">Management</SelectItem>
//               </SelectContent>
//             </Select>

//             <Button variant="outline" size="icon">
//               <SlidersHorizontal className="h-4 w-4" />
//               <span className="sr-only">Advanced filters</span>
//             </Button>
//           </div>
//         </div>

//         {/* Results count */}
//         <div className="mb-6">
//           <p className="text-muted-foreground">
//             Showing {filteredPeople.length}{" "}
//             {filteredPeople.length === 1 ? "result" : "results"}
//           </p>
//         </div>

//         {/* Results grid */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredPeople.map((person) => (
//             <Card key={person.id} className="overflow-hidden">
//               <CardHeader className="p-0">
//                 <div className="bg-muted relative h-48 w-full">
//                   <Image
//                     src={person.imageUrl || "/placeholder.svg"}
//                     alt={person.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="flex flex-col space-y-2">
//                   <h3 className="text-foreground text-xl font-semibold">
//                     {person.name}
//                   </h3>
//                   <div className="text-muted-foreground flex items-center">
//                     <Briefcase className="mr-2 h-4 w-4" />
//                     <span>{person.role}</span>
//                   </div>
//                   <div className="text-muted-foreground flex items-center">
//                     <MapPin className="mr-2 h-4 w-4" />
//                     <span>{person.location}</span>
//                   </div>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {person.skills.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="bg-muted/50 border-t px-6 py-4">
//                 <Button variant="outline" className="w-full">
//                   <User2 className="mr-2 h-4 w-4" />
//                   View Profile
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>

//         {/* Pagination */}
//         {filteredPeople.length > 0 && (
//           <div className="mt-8 flex justify-center">
//             <Button variant="outline" className="mx-1">
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               className="bg-primary text-primary-foreground mx-1"
//             >
//               1
//             </Button>
//             <Button variant="outline" className="mx-1">
//               2
//             </Button>
//             <Button variant="outline" className="mx-1">
//               3
//             </Button>
//             <Button variant="outline" className="mx-1">
//               Next
//             </Button>
//           </div>
//         )}

//         {/* No results */}
//         {filteredPeople.length === 0 && (
//           <div className="py-12 text-center">
//             <div className="bg-muted mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full">
//               <Search className="text-muted-foreground h-6 w-6" />
//             </div>
//             <h3 className="text-foreground mb-2 text-lg font-medium">
//               No results found
//             </h3>
//             <p className="text-muted-foreground">
//               Try adjusting your search or filter to find what you're looking
//               for
//             </p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
