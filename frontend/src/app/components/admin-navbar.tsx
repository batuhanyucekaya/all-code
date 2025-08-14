"use client"

import React from "react"

type SidebarProps = {
    menuItems: string[]
    activeItem: string
    onSelect: (item: string) => void
}

export default function Sidebar({ menuItems, activeItem, onSelect }: SidebarProps) {
    return (
        <aside className="w-60 bg-white shadow-md flex flex-col h-screen">
            <div className="p-4 font-bold text-xl border-b">Admin Panel</div>
            <nav className="flex-grow">
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item}
                            onClick={() => onSelect(item)}
                            className={`cursor-pointer px-4 py-3 hover:bg-gray-200 ${activeItem === item ? "bg-gray-300 font-semibold" : ""
                                }`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}
