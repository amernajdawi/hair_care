// @ts-nocheck
import React, { ReactNode, createContext, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import { cn } from '../lib/utils'

const AccordionContext = createContext<{
  expanded: string | string[]
  setExpanded: React.Dispatch<React.SetStateAction<string | string[]>>
  multiple?: boolean
}>({
  expanded: '',
  setExpanded: () => {},
})

export const AccordionContainer: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={cn("grid gap-4", className)}>
      {children}
    </div>
  )
}

export const AccordionWrapper: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <div className="space-y-4">{children}</div>
}

export const Accordion: React.FC<{
  children: React.ReactNode
  multiple?: boolean
  defaultValue?: string | string[]
}> = ({ children, multiple = false, defaultValue = '' }) => {
  const [expanded, setExpanded] = useState<string | string[]>(
    multiple ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : defaultValue
  )

  return (
    <AccordionContext.Provider value={{ expanded, setExpanded, multiple }}>
      {children}
    </AccordionContext.Provider>
  )
}

export const AccordionItem: React.FC<{
  children: React.ReactNode
  value: string
}> = ({ children, value }) => {
  const { expanded, setExpanded, multiple } = useContext(AccordionContext)

  const isExpanded = multiple
    ? (expanded as string[]).includes(value)
    : expanded === value

  const toggleExpanded = () => {
    if (multiple) {
      setExpanded((prev: string | string[]) =>
        isExpanded
          ? (prev as string[]).filter((item) => item !== value)
          : [...(prev as string[]), value]
      )
    } else {
      setExpanded(isExpanded ? '' : value)
    }
  }

  return (
    <motion.div
      className="border rounded-lg overflow-hidden shadow-sm"
      style={{
        backgroundColor: 'rgba(247, 216, 216, 0.7)',
        borderColor: '#F7D8D8',
      }}
      initial={false}
      animate={{ 
        boxShadow: isExpanded 
          ? '0 5px 15px rgba(247, 216, 216, 0.4)' 
          : '0 2px 4px rgba(255, 182, 193, 0.3)'
      }}
      transition={{ duration: 0.3 }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isExpanded,
            toggleExpanded,
          })
        }
        return child
      })}
    </motion.div>
  )
}

export const AccordionHeader: React.FC<{
  children: React.ReactNode
  isExpanded?: boolean
  toggleExpanded?: () => void
}> = ({ children, isExpanded, toggleExpanded }) => {
  return (
    <motion.div
      className="flex items-center p-4 cursor-pointer"
      onClick={toggleExpanded}
      style={{
        background: 'linear-gradient(to bottom, #FBE6E6 0%, #FFF0F0 100%)',
        color: '#8B7E7E',
      }}
      whileHover={{ backgroundColor: '#F7D8D8' }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-sm font-medium flex items-center w-full">
        {isExpanded ? (
          <X size={16} color="#8B7E7E" className="mr-2 flex-shrink-0" />
        ) : (
          <Plus size={16} color="#8B7E7E" className="mr-2 flex-shrink-0" />
        )}
        {children}
      </h3>
    </motion.div>
  )
}

export const AccordionPanel: React.FC<{
  children: React.ReactNode
  isExpanded?: boolean
}> = ({ children, isExpanded }) => {
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          <motion.div 
            className="p-4 text-sm"
            style={{
              backgroundColor: 'linear-gradient(135deg, #FBE6E6 0%, #FFF0F0 100%)',
              color: '#8B7E7E',
            }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
