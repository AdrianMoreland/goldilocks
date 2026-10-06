import { Badge } from "@goldilocks/ui/badge";
import { Button } from "@goldilocks/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@goldilocks/ui/card";

export function meta() {
  return [{ title: "Merrion Gold" }];
}

// Placeholder that proves the pipeline: shared primitives, the Heritage Vault theme and prerendering.
// The real home page is built from design/specs once the public header and price ticker exist.
export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-24">
      <Badge variant="secondary" className="w-fit">
        Under construction
      </Badge>
      <h1 className="font-heading text-5xl leading-tight">Merrion Gold</h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Gold, silver, platinum and palladium, bought and sold at live prices.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Call the trading desk</CardTitle>
          <CardDescription>Monday to Friday</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button asChild>
            <a href="tel:+35312547901">01 254 7901</a>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
