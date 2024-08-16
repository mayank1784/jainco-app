interface Variations {
  // [key: string]: string[] | (string | string[])[];
  [key: string]: (string | [string, string])[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  lowerPrice: number;
  upperPrice: number;
  mainImage: string;
  // otherImages: string[]; optional attribute
  variations: Variations;
  keywords: string[];
  [key: string]: any; // For any additional dynamic properties
}
interface Category {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
}
const data:Product[] = [
  {
    id: "001",
    name: "Kumkum Table Cover",
    description: "Non woven table cloth with lace or with paipin",
    category: "Table Covers",
    lowerPrice: 45,
    upperPrice: 150,
    mainImage:
      "https://www.jiomart.com/images/product/original/rvznhdjgjh/lushomes-table-cloth-cotton-table-cloth-round-table-cover-blue-checks-sheet-used-for-study-dastarkhan-tea-cyclinder-cover-teapoy-size-40-inch-round-2-seater-round-oval-dining-table-cloth-product-images-orvznhdjgjh-p603337933-0-202307280651.jpg",
    otherImages: [
      "https://www.urbanspacestore.in/cdn/shop/products/81onGzBaszL._AC_SL1500.jpg?v=1649300755",
      "https://m.media-amazon.com/images/I/71vl-u2UDtL._AC_UF894,1000_QL80_.jpg",
      "https://i.etsystatic.com/14630966/r/il/bc6cbd/2427291741/il_fullxfull.2427291741_skoo.jpg",
    ],
    variations: {
      size: ["S", "M", "L", "XL", "XXL"],
      type: [
        "Lace",
        [
          "Without Lace",
          "https://5.imimg.com/data5/RC/EM/MY-5429380/table-cover.jpg",
        ],
        "Paipin",
      ],
      thickness: ["0.15mm", "0.20mm"],
    },
    keywords: [
      "kumkum",
      "table cover",
      "non woven",
      "S M L XL XXL",
      "4 seater",
      "6 seater",
    ],
  },
  {
    id: "002",
    name: "Cotton Net Table Cover",
    description: "Net table cloth with woven designs",
    category: "Table Covers",
    lowerPrice: 55,
    upperPrice: 200,
    mainImage: "https://5.imimg.com/data5/UD/QO/TG/SELLER-97658637/1.jpg",
    otherImages: [
      "https://m.media-amazon.com/images/I/71YvyH93FnL._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/71Y0qZ0pasS.jpg",
      "https://m.media-amazon.com/images/I/61JVdPP-s+L._AC_UF894,1000_QL80_.jpg",
    ],
    variations: {
      size: ['36" x 60"', '45" x 70"', '54" x 78"', '60" x 90"'],
      type: [
        "Patta",
        ["Croatia", "https://m.media-amazon.com/images/I/81rXFPuWFVL.jpg"],
      ],
    },
    keywords: [
      "net",
      "cotton",
      "croatia",
      "40 60 90 54 78",
      "4 seater",
      "6 seater",
    ],
  },
  {
    id: "003",
    name: "Diamond Table Cover",
    description: "PVC translucent coin embossed table cover",
    category: "Table Covers",
    lowerPrice: 55,
    upperPrice: 199,
    mainImage:
      "https://www.jiomart.com/images/product/original/rvj7wept18/aradent-coin-design-silver-lace-transparent-pvc-center-table-cover-size-40x60-inches-product-images-orvj7wept18-p598303555-0-202302111224.jpg?im=Resize=(1000,1000)",
    otherImages: [
      "https://m.media-amazon.com/images/I/61nojvrS6SL._AC_UF894,1000_QL80_.jpg",
    ],
    variations: {
      size: ['40" x 60"', '45" x 70"', '54" x 78"', '60" x 90"'],
      type: ["Golden Lace", "Silver Lace", "Beige Lace"],
    },
    keywords: [
      "diamond",
      "pvc",
      "clear",
      "40 60 90 54 78",
      "4 seater",
      "6 seater",
      "transparent",
      "coin",
      "golden",
      "silver",
    ],
  },
  {
    id: "004",
    name: "Cherry Table Covers",
    description: "PVC golden cherry table cover",
    category: "Table Covers",
    lowerPrice: 65,
    upperPrice: 130,
    mainImage:
      "https://www.jiomart.com/images/product/original/rvj7wept18/aradent-coin-design-silver-lace-transparent-pvc-center-table-cover-size-40x60-inches-product-images-orvj7wept18-p598303555-0-202302111224.jpg?im=Resize=(1000,1000)",
    otherImages: [
      "https://m.media-amazon.com/images/I/61nojvrS6SL._AC_UF894,1000_QL80_.jpg",
    ],
    variations: {
      size: ['40" x 60"', '45" x 70"', '54" x 78"', '60" x 90"'],
      type: ["Golden Lace", "Panel"],
      aaloo: ["dtf", "ftft", "ftftf", "tftft", "ftdft"],
    },
    keywords: [
      "diamond",
      "pvc",
      "clear",
      "40 60 90 54 78",
      "4 seater",
      "6 seater",
      "transparent",
      "coin",
      "golden",
      "silver",
    ],
    unavailableCombinations: [
      { size: '40" x 60"', type: "Golden Lace" },
      { size: '40" x 60"', aaloo: "dtf" },
      { type: "Panel", size: '45" x 70"' },
      { type: "Panel", size: '54" x 78"' },
      { type: "Panel", size: '60" x 90"',aaloo:"ftftf" },
    ],
  },
];

export default data;
