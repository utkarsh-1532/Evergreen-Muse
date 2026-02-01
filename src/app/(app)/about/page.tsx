import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";

export default function AboutPage() {
  const projectInfo = `
Core Purpose:
A social network for personal growth. Users can share content like music, images, and blog-style stories, fostering a community around self-improvement and creative expression.

Data Structure:
- UserProfile Collection:
  - id: string (Unique identifier for the profile)
  - userId: string (Links to Firebase Auth user)
  - username: string (Unique, user-chosen handle)
  - email: string (User's email address)
  - profilePicUrl: string (URL for profile picture)
  - bio: string (Short user biography)
  - createdAt: timestamp (Profile creation date)

- Post Collection (as a subcollection of a user):
  - id: string (Unique identifier for the post)
  - authorId: string (Links to the author's UserProfile)
  - title: string (Optional title for the post)
  - text: string (Main content of the post)
  - imageUrl: string (URL for an attached image)
  - imageCaption: string (Caption for the image)
  - songTitle: string (Title of an associated song)
  - songArtist: string (Artist of the associated song)
  - timestamp: timestamp (Post creation date)
  - likeIds: array (List of userIds who liked the post)

Tech Stack:
- Framework: Next.js (with App Router)
- UI Library: React with TypeScript
- Backend & Database: Firebase (Authentication and Firestore)
- Styling: Tailwind CSS
- UI Components: ShadCN UI

Design Rules:
- Layout: A main content area with a collapsible sidebar for navigation. The design is responsive and clean.
- Color Palette (Theme: Evergreen Muse):
  - Primary: A soothing green (HSL: 120 25% 65%) used for key actions and highlights.
  - Background: A light, off-white (HSL: 240 100% 99%) for a clean and airy feel.
  - Text/Foreground: A dark, desaturated blue-gray (HSL: 204 19% 26%) for readability.
  - Accent: A slightly darker shade of green/gray for secondary elements.
`;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Project Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground bg-muted p-4 rounded-md">
            {projectInfo.trim()}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
