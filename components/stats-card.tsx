"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface StatsCardProps {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
}

export function StatsCard({ label, value, change, trend, icon: Icon }: StatsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-4 lg:p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trend === "up" ? "text-success" : "text-destructive"
        }`}>
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
        </div>
      </div>
      
      <div>
        <p className="text-2xl lg:text-3xl font-bold text-foreground">{value}</p>
        <p className="text-xs lg:text-sm text-muted-foreground mt-1">{label}</p>
        <p className={`text-xs mt-1 ${
          trend === "up" ? "text-success" : "text-destructive"
        }`}>
          {change}
        </p>
      </div>
    </div>
  )
}
