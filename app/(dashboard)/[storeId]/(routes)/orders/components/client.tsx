"use client";

import { OrderColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { PlusIcon } from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator";

interface OrderClientProps {
    data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    return (
        <>
            <Heading
                title={`Orders (${data?.length})`}
                description="Manage your billboards for your store"
            />
            <Separator />
            <DataTable columns={columns} data={data} searchKey="label" />
        </>
    );
};
