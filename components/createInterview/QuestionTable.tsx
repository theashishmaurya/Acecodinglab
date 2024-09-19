"use client"
import { DataTable } from "@/components/ui/data-grid"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "../ui/button"
import { ArrowUpDown } from "lucide-react"
import { useEffect, useState } from "react"
import { getListOfQuestions } from "./getQuestions.action"
  
  const data = [
    {
      id: 1,
      name: "React Basics",
      difficulty: "Beginner",
      tags: ["React", "JavaScript"],
      author: "John Doe",
    },
    {
      id: 2,
      name: "Advanced TypeScript",
      difficulty: "Advanced",
      tags: ["TypeScript", "Programming"],
      author: "Jane Smith",
    },
    {
      id: 3,
      name: "CSS Flexbox Layout",
      difficulty: "Intermediate",
      tags: ["CSS", "Web Design"],
      author: "Alice Johnson",
    },
    {
      id: 4,
      name: "Node.js API Development",
      difficulty: "Intermediate",
      tags: ["Node.js", "API", "Backend"],
      author: "Bob Wilson",
    },
    {
      id: 5,
      name: "Vue.js for Beginners",
      difficulty: "Beginner",
      tags: ["Vue.js", "JavaScript"],
      author: "Eva Brown",
    },
  ]

  export type QuestionTable = {
    id: string
    name: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    tags: []
    author:string
  }
  
  const columns: ColumnDef<QuestionTable>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }
          }
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "difficulty",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Difficulty
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("difficulty")}</div>,
    },
    {
      accessorKey: "tags",
      header: () => <div className="text-right">tage</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">tags</div>
      },
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <div className="lowercase">{row.getValue("author")}</div>,
    },
    
  ]
  
   
  export default function QuestionTable() {
    const [data,setData] = useState<QuestionTable[]>([])
    const [checkedRows,setOnCheckedRows]= useState<QuestionTable[]>([])

    

    useEffect(()=>{
      getListOfQuestions().then((data)=>{
        setData(data as QuestionTable[])
      })
    },[])

    const handleRowChange = (data:unknown[])=>{
      console.log(data)
      setOnCheckedRows(data as QuestionTable[])
    }

    return (
      <div className="container mx-auto flex items-start">
        <DataTable data={data} columns={columns} onCheckChange={handleRowChange}  />
      </div>
    )
  }