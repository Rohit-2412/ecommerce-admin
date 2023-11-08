"use client";

import { CellAction } from "./cell-action";
import { ColumnDef } from "@tanstack/react-table";

// id: item.id,
//         phone: item.phone,
//         address: item.address,
//         products: item.orderItems
//             .map((orderItem) => orderItem.product.name)
//             .join(", "),
//         totalPrice: formatter.format(
//             item.orderItems.reduce(
//                 (acc, item) => acc + Number(item.product.price),
//                 0
//             )
//         ),
//         createdAt: format(item.createdAt, "MMMM do, yyyy"),
export type OrderColumn = {
    id: string;
    phone: string;
    address: string;
    products: string;
    totalPrice: string;
    isPaid: boolean;
    createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "products",
        header: "Products",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "totalPrice",
        header: "Total Price",
    },
    {
        accessorKey: "isPaid",
        header: "Paid",
    },
];
