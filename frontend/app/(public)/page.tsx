// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { GraduationCap, School, Users } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col min-h-screen bg-red-700">
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
//         <div className="container flex h-14 items-center">
//           <div className="mr-4 hidden md:flex">
//             <Link href="/" className="mr-6 flex items-center space-x-2">
//               <School className="h-6 w-6" />
//               <span className="hidden font-bold sm:inline-block">
//                 A.M.FOFANA HIGH SCHOOL
//               </span>
//             </Link>
//             <nav className="flex items-center space-x-6 text-sm font-medium">
//               <Link href="#">About</Link>
//               <Link href="#">Programs</Link>
//               <Link href="#">Contact</Link>
//             </nav>
//           </div>
//           <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
//             <nav className="flex items-center">
//               <Button variant="ghost">Login</Button>
//               <Button>Register</Button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1">
//         <section className="py-12 md:py-24 lg:py-32 xl:py-48">
//           <div className="container px-4 md:px-6">
//             <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
//               <div className="flex flex-col justify-center space-y-4">
//                 <div className="space-y-2">
//                   <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                     AMFOFANA HIGH SCHOOL
//                   </h1>
//                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
//                     Excellence in Education. Future Leaders in the Making.
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                   <Button size="lg">Login</Button>
//                   <Button size="lg" variant="outline">
//                     Register
//                   </Button>
//                 </div>
//               </div>
//               <Image
//                 alt="Hero"
//                 className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
//                 height="550"
//                 src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//                 width="550"
//               />
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
//           <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
//             <div className="space-y-3">
//               <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                 Why Choose Us?
//               </h2>
//               <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                 Providing quality education and shaping the future of our students.
//               </p>
//             </div>
//             <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <GraduationCap /> Smart Classrooms
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>
//                     Our classrooms are equipped with the latest technology to
//                     enhance the learning experience.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users /> Dedicated Teachers
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>
//                     Our experienced and passionate teachers are committed to
//                     student success.
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <School /> Digital Report Cards
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>
//                     Access student progress and reports online, anytime.
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>
//       </main>

//       <footer className="flex-shrink-0 border-t">
//         <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-6">
//           <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
//             <School className="h-6 w-6" />
//             <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
//               © 2025 AMFOFANA HIGH SCHOOL. All rights reserved.
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <a href="#">Facebook</a>
//             <a href="#">Twitter</a>
//             <a href="#">Instagram</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
