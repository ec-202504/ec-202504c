import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useState } from "react";

type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, query: string) => void;
};

export default function SearchForm({ onSubmit }: Props) {
  const [query, setQuery] = useState<string>("");
  return (
    <form
      onSubmit={(e) => onSubmit(e, query)}
      method="post"
      className="flex gap-2 mb-[10px] p-[20px] bg-gray-50 rounded-md shadow-2xs"
    >
      <Input
        name="query"
        type="text"
        placeholder="キーワードを入力してください"
        className="bg-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">検索</Button>
    </form>
  );
}
// import { Button } from "../../../components/ui/button";
// import { useRef, useState } from "react";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "../../../components/ui/command";
// import type { Product } from "../types";

// // const products = [
// //     {
// //         value: "next.js",
// //         name: "Next.js",
// //     },
// //     {
// //         value: "sveltekit",
// //         name: "SvelteKit",
// //     },
// //     {
// //         value: "nuxt.js",
// //         name: "Nuxt.js",
// //     },
// //     {
// //         value: "remix",
// //         name: "Remix",
// //     },
// //     {
// //         value: "astro",
// //         name: "Astro",
// //     },
// // ];

// type Props = {
//     allProducts: Product[];
//     onSubmit: (e: React.FormEvent<HTMLFormElement>, query: string) => void;
// };

// export default function SearchForm({ allProducts, onSubmit }: Props) {
//     const [query, setQuery] = useState<string>("");
//     const inputRef = useRef<HTMLInputElement>(null);
//     return (
//         <form
//             onSubmit={(e) => onSubmit(e, query)}
//             className="flex gap-2 mb-[10px] p-[20px] bg-gray-50 rounded-md shadow-2xs"
//         >
//             <Command
//                 className="rounded-lg border shadow-md h-auto max-h-[150px] overflow-y-auto
//              [&::-webkit-scrollbar]:hidden
//              [-ms-overflow-style:none]
//              [scrollbar-width:none]"
//             >
//                 <CommandInput
//                     ref={inputRef}
//                     name="query"
//                     placeholder="キーワードを入力してください"
//                     className="bg-white"
//                     onInput={(e) =>
//                         setQuery((e.target as HTMLInputElement).value)
//                     }
//                 />
//                 {query && (
//                     <CommandList>
//                         <CommandEmpty>
//                             該当する商品が見つかりません
//                         </CommandEmpty>
//                         <CommandGroup heading="Suggestions">
//                             {allProducts.map((product) => (
//                                 <CommandItem
//                                     key={product.name}
//                                     value={product.name}
//                                 >
//                                     <span>{product.name}</span>
//                                 </CommandItem>
//                             ))}
//                         </CommandGroup>
//                     </CommandList>
//                 )}
//             </Command>
//             <Button type="submit">検索</Button>
//         </form>
//     );
// }
