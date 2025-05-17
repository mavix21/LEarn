"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";
import { Input } from "@skill-based/ui/components/input";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { SearchCard, SearchCardSkeleton } from "./ui/SearchCard";

const ITEMS_PER_PAGE = 6;

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);

  // Query for paginated users
  const paginatedUsers = useQuery(api.posts.getUsers, {
    paginationOpts: {
      numItems: ITEMS_PER_PAGE,
      cursor: cursor,
    },
  });

  // Filter people based on search query
  const filteredPeople = paginatedUsers?.page.filter((person) => {
    const matchesSearch = person.displayName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch;
  });

  const totalPages = Math.ceil(
    (paginatedUsers?.page.length ?? 0) / ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset cursor when changing pages
    setCursor(null);
  };

  const handleNextPage = () => {
    if (paginatedUsers?.continueCursor) {
      setCursor(paginatedUsers.continueCursor);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Reset cursor when going back
      setCursor(null);
    }
  };

  return (
    <div className="bg-background h-full overflow-y-auto">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col space-y-4">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Find Professionals
          </h1>
          <p className="text-muted-foreground">
            Search for talented professionals across various industries and
            roles
          </p>
        </div>
        {/* Search and filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              type="text"
              placeholder="Search by name, role, skills or location"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredPeople?.length ?? 0}{" "}
            {filteredPeople?.length === 1 ? "result" : "results"}
          </p>
        </div>
        {/* Results grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredPeople === undefined ? (
            <>
              <SearchCardSkeleton />
              <SearchCardSkeleton />
            </>
          ) : (
            filteredPeople.map((user) => (
              <SearchCard
                key={user._id}
                displayName={user.displayName as Id<"users">}
                followingId={user._id}
              />
            ))
          )}
        </div>
        {/* Pagination */}
        {filteredPeople && filteredPeople.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              className="mx-1"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || totalPages <= 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                className="mx-1"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              className="mx-1"
              onClick={handleNextPage}
              disabled={!paginatedUsers?.continueCursor || totalPages <= 1}
            >
              Next
            </Button>
          </div>
        )}
        {/* No results */}
        {filteredPeople && filteredPeople.length === 0 && (
          <div className="py-12 text-center">
            <div className="bg-muted mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full">
              <Search className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-medium">
              No results found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking
              for
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
