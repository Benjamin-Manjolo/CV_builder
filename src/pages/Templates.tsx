import { useState } from "react";
import { templates } from "@/data/templates";
import TemplateCard from "@/components/TemplateCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = ["All", "Professional", "Minimalist", "Creative", "Academic"];
const filters = ["All", "Free", "Premium"];

const Templates = () => {
  const [category, setCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = templates.filter((t) => {
    if (category !== "All" && t.category !== category) return false;
    if (priceFilter === "Free" && t.isPremium) return false;
    if (priceFilter === "Premium" && !t.isPremium) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              CV Templates
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose a template to get started. Free templates are ready to use — premium templates unlock with a Pro plan.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setCategory(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {filters.map((f) => (
                <Button
                  key={f}
                  variant={priceFilter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-16">No templates match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;
