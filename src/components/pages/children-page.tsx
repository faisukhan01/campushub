"use client";

import { Heart } from "lucide-react";

export function ChildrenPage() {
  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Children</h1>
        <p className="text-muted-foreground">View your children's academic progress</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-pink-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No children linked</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your children's profiles will appear here once linked by the Branch Admin.
        </p>
      </div>
    </div>
  );
}
