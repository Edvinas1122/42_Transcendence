"use client";
import React, { useEffect, useRef } from "react";
import "@/public/layout.css";

const UIClientListBox: Function = ({ Items, BoxComponent, ListStyle, BoxStyle }: { Items: any[], BoxComponent: Function, ListStyle?: string, BoxStyle?: string}) => {

    const endOfListRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [Items]);

    return (
        <div className={"List " + ListStyle}>
            {Items.map((item: any) => {
                return (
                    <BoxComponent key={item._id} item={item} style={BoxStyle} />
                );
            })}
            <div ref={endOfListRef} />
        </div>
    );
}

export default UIClientListBox;