// স্কিলের নাম থেকে আইকন: shields.io ব্যাজের জন্য simple-icons slug ও রং, আর skillicons.dev id
export interface TechIcon {
  si?: string; // simple-icons slug (shields.io logo)
  color: string; // hex, # ছাড়া
  skill?: string; // skillicons.dev id
}

const T: [string[], TechIcon][] = [
  [["javascript", "js", "es6"], { si: "javascript", color: "F7DF1E", skill: "js" }],
  [["typescript", "ts"], { si: "typescript", color: "3178C6", skill: "ts" }],
  [["python", "py"], { si: "python", color: "3776AB", skill: "py" }],
  [["java"], { si: "openjdk", color: "ED8B00", skill: "java" }],
  [["kotlin"], { si: "kotlin", color: "7F52FF", skill: "kotlin" }],
  [["swift"], { si: "swift", color: "F05138", skill: "swift" }],
  [["dart"], { si: "dart", color: "0175C2", skill: "dart" }],
  [["go", "golang"], { si: "go", color: "00ADD8", skill: "go" }],
  [["rust"], { si: "rust", color: "000000", skill: "rust" }],
  [["php"], { si: "php", color: "777BB4", skill: "php" }],
  [["ruby"], { si: "ruby", color: "CC342D", skill: "ruby" }],
  [["c"], { si: "c", color: "A8B9CC", skill: "c" }],
  [["c++", "cpp"], { si: "cplusplus", color: "00599C", skill: "cpp" }],
  [["c#", "csharp"], { color: "512BD4", skill: "cs" }],
  [["html", "html5"], { si: "html5", color: "E34F26", skill: "html" }],
  [["css", "css3"], { si: "css", color: "1572B6", skill: "css" }],
  [["react", "reactjs"], { si: "react", color: "61DAFB", skill: "react" }],
  [["reactnative"], { si: "react", color: "61DAFB", skill: "react" }],
  [["nextjs", "next"], { si: "nextdotjs", color: "000000", skill: "nextjs" }],
  [["vue", "vuejs"], { si: "vuedotjs", color: "4FC08D", skill: "vue" }],
  [["nuxt", "nuxtjs"], { si: "nuxt", color: "00DC82", skill: "nuxtjs" }],
  [["angular", "angularjs"], { si: "angular", color: "DD0031", skill: "angular" }],
  [["svelte", "sveltekit"], { si: "svelte", color: "FF3E00", skill: "svelte" }],
  [["redux", "reduxtoolkit"], { si: "redux", color: "764ABC", skill: "redux" }],
  [["tailwind", "tailwindcss"], { si: "tailwindcss", color: "06B6D4", skill: "tailwind" }],
  [["bootstrap"], { si: "bootstrap", color: "7952B3", skill: "bootstrap" }],
  [["sass", "scss"], { si: "sass", color: "CC6699", skill: "sass" }],
  [["jquery"], { si: "jquery", color: "0769AD", skill: "jquery" }],
  [["alpinejs", "alpine"], { si: "alpinedotjs", color: "8BC0D0" }],
  [["nodejs", "node"], { si: "nodedotjs", color: "5FA04E", skill: "nodejs" }],
  [["express", "expressjs"], { si: "express", color: "000000", skill: "express" }],
  [["nestjs", "nest"], { si: "nestjs", color: "E0234E", skill: "nestjs" }],
  [["django"], { si: "django", color: "092E20", skill: "django" }],
  [["flask"], { si: "flask", color: "000000", skill: "flask" }],
  [["fastapi"], { si: "fastapi", color: "009688", skill: "fastapi" }],
  [["laravel"], { si: "laravel", color: "FF2D20", skill: "laravel" }],
  [["spring", "springboot"], { si: "spring", color: "6DB33F", skill: "spring" }],
  [["dotnet", ".net", "aspnet", "aspnetcore"], { si: "dotnet", color: "512BD4", skill: "dotnet" }],
  [["graphql"], { si: "graphql", color: "E10098", skill: "graphql" }],
  [["prisma"], { si: "prisma", color: "2D3748", skill: "prisma" }],
  [["flutter"], { si: "flutter", color: "02569B", skill: "flutter" }],
  [["android"], { si: "android", color: "34A853", skill: "androidstudio" }],
  [["ios"], { si: "apple", color: "000000", skill: "apple" }],
  [["mysql"], { si: "mysql", color: "4479A1", skill: "mysql" }],
  [["postgresql", "postgres"], { si: "postgresql", color: "4169E1", skill: "postgres" }],
  [["mongodb", "mongo"], { si: "mongodb", color: "47A248", skill: "mongodb" }],
  [["redis"], { si: "redis", color: "FF4438", skill: "redis" }],
  [["sqlite"], { si: "sqlite", color: "003B57", skill: "sqlite" }],
  [["firebase"], { si: "firebase", color: "FFCA28", skill: "firebase" }],
  [["supabase"], { si: "supabase", color: "3FCF8E", skill: "supabase" }],
  [["docker"], { si: "docker", color: "2496ED", skill: "docker" }],
  [["kubernetes", "k8s"], { si: "kubernetes", color: "326CE5", skill: "kubernetes" }],
  [["aws", "amazonwebservices"], { color: "FF9900", skill: "aws" }],
  [["gcp", "googlecloud"], { si: "googlecloud", color: "4285F4", skill: "gcp" }],
  [["azure"], { color: "0078D4", skill: "azure" }],
  [["vercel"], { si: "vercel", color: "000000", skill: "vercel" }],
  [["netlify"], { si: "netlify", color: "00C7B7", skill: "netlify" }],
  [["nginx"], { si: "nginx", color: "009639", skill: "nginx" }],
  [["linux"], { si: "linux", color: "FCC624", skill: "linux" }],
  [["git"], { si: "git", color: "F05032", skill: "git" }],
  [["github"], { si: "github", color: "181717", skill: "github" }],
  [["githubactions"], { si: "githubactions", color: "2088FF", skill: "githubactions" }],
  [["gitlab"], { si: "gitlab", color: "FC6D26", skill: "gitlab" }],
  [["figma"], { si: "figma", color: "F24E1E", skill: "figma" }],
  [["jest"], { si: "jest", color: "C21325", skill: "jest" }],
  [["vite"], { si: "vite", color: "646CFF", skill: "vite" }],
  [["webpack"], { si: "webpack", color: "8DD6F9", skill: "webpack" }],
  [["wordpress"], { si: "wordpress", color: "21759B", skill: "wordpress" }],
  [["threejs", "three"], { si: "threedotjs", color: "000000", skill: "threejs" }],
  [["electron"], { si: "electron", color: "47848F", skill: "electron" }],
  [["tensorflow"], { si: "tensorflow", color: "FF6F00", skill: "tensorflow" }],
  [["pytorch"], { si: "pytorch", color: "EE4C2C", skill: "pytorch" }],
  [["rabbitmq"], { si: "rabbitmq", color: "FF6600", skill: "rabbitmq" }],
  [["kafka", "apachekafka"], { si: "apachekafka", color: "231F20", skill: "kafka" }],
  [["elasticsearch"], { si: "elasticsearch", color: "005571", skill: "elasticsearch" }],
  [["postman"], { si: "postman", color: "FF6C37", skill: "postman" }],
  [["vscode", "visualstudiocode"], { color: "007ACC", skill: "vscode" }],
  [["bash", "shell"], { si: "gnubash", color: "4EAA25", skill: "bash" }],
];

const MAP = new Map<string, TechIcon>();
for (const [keys, icon] of T) for (const k of keys) MAP.set(k, icon);

// "Next.js" → "nextjs", "AWS (EC2, S3)" → "aws", "Tailwind CSS" → "tailwindcss"
export const techKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[\s._\-/]+/g, "")
    .trim();

export const techIcon = (name: string): TechIcon | undefined => MAP.get(techKey(name));
