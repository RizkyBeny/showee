"use client"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from 'next/link'

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-8 w-8 flex items-center justify-center rounded-full outline-none hover:opacity-80">
          <Avatar className="h-8 w-8">
            <AvatarFallback>RN</AvatarFallback>
          </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Rina EO</p>
              <p className="text-xs leading-none text-muted-foreground">
                rina@eo.com
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground p-0">
             <Link href="/login" className="w-full flex items-center px-1.5 py-1">
               <LogOut className="mr-2 h-4 w-4" />
               <span>Log out</span>
             </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
