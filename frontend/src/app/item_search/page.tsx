"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import SearchItems from "@/components/item-search/itemSearch";
import Advertisement from "@/components/promotions/promotions";

export default function GymSearch() {
  return (
    <SearchItems />
    // <div className="flex flex-col h-full">
    //   <main className="flex-1" />
    //   <div className="bg-background border-t">
    //     <div className="container px-4 md:px-6 py-4 flex justify-between">
    //       <Tabs defaultValue="gyms" className="w-full">
    //         <TabsList className="flex border-b">
    //           <TabsTrigger
    //             value="gyms"
    //             className="flex-1 text-center py-2"
    //           >
    //             Gyms
    //           </TabsTrigger>
    //           <TabsTrigger
    //             value="offers"
    //             className="flex-1 text-center py-2"
    //           >
    //             Promotions
    //           </TabsTrigger>
    //         </TabsList>
    //         <TabsContent value="gyms">
    //           <SearchGyms />
    //         </TabsContent>
    //         <TabsContent value="offers">
    //         <Advertisement />
    //         </TabsContent>
    //       </Tabs>
    //     </div>
    //   </div>
    // </div>
  );
}
