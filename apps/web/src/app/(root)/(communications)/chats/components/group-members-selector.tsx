"use client";
import { FormField, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label"
import MultipleSelector, { type Option } from "@/components/ui/multiselect"
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query"
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

interface GroupMemberSelectorProps {
    control: Control<any>;
    name: string;
}

export default function GroupMemberSelector({ control, name }: GroupMemberSelectorProps) {
    const { data, isLoading } = useQuery(trpc.chat.getUserFriends.queryOptions());
    const friends = data?.map((ele) => {
        return { value: ele.id, label: ele.name }
    }) as Option[];

    if (isLoading) return (
        <>
            <Label>Choose your friends</Label>
            <Skeleton className="w-full h-9" />
        </>
    );

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // Convert string[] to Option[]
                const selectedOptions = friends?.filter(friend =>
                    field.value?.includes(friend.value)
                ) || [];

                return (
                    <div className="*:not-first:mt-2">
                        <Label>Choose your friends</Label>
                        <MultipleSelector
                            value={selectedOptions}
                            onChange={(options: Option[]) => {
                                // Convert Option[] back to string[]
                                const values = options.map(opt => opt.value);
                                field.onChange(values);
                            }}
                            commandProps={{
                                label: "Select friends",
                            }}
                            defaultOptions={friends || []}
                            placeholder="Select friends"
                            emptyIndicator={<p className="text-center text-sm">No results found</p>}
                        />
                        <FormMessage />
                    </div>
                );
            }}
        />
    )
}