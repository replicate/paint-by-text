const seeds = [
  {
    image:
      "https://user-images.githubusercontent.com/2289/215219780-cb4a0cdb-6fea-46fe-ae22-12d68e5ba79f.jpg",
    prompt: "make his jacket out of leather",
  },
  {
    image:
      "https://user-images.githubusercontent.com/2289/215241066-654c5acf-8293-4fb1-a85d-c87a0297a30b.jpg",
    prompt: "what would it look like if it were snowing?",
  },
];

export function getRandomSeed() {
  return seeds[Math.floor(Math.random() * seeds.length)];
}
