"use client";

import { BillboardColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";

import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { PlusIcon } from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator";

interface BillboardClientProps {
    data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data?.length})`}
                    description="Manage your billboards for your store"
                />
                <Button
                    onClick={() =>
                        router.push(`/${params.storeId}/billboards/new`)
                    }
                >
                    <PlusIcon className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="label" />
            <Heading title="API" description="API calls for billboards" />
            <Separator />
            <ApiList entityIdName="billboardId" entityName="billboards" />
        </>
    );
};
