import { Link } from "@/components/fastLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ArrowLeft, Construction } from "lucide-react";

interface ComingSoonProps {
	title: string;
	description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
	return (
		<div className="flex flex-1 items-center justify-center p-6">
			<Card className="max-w-md border-dashed">
				<CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<Construction className="h-8 w-8 text-muted-foreground" />
					</div>
					<div className="space-y-2">
						<h2 className="font-semibold text-xl">{title}</h2>
						<p className="text-muted-foreground text-sm">{description}</p>
					</div>
					<Button variant="outline" asChild>
						<Link href="/dashboard">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Dashboard
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
