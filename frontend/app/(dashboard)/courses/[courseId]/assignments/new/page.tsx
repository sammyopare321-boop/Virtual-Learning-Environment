'use client';

import AssignmentBuilder from '@/components/builder/AssignmentBuilder';
import { motion } from 'framer-motion';

import { useParams } from 'next/navigation';

export default function NewAssignmentPage() {
  const { courseId } = useParams() as { courseId: string };
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-[#F8FAFC]"
    >
      <AssignmentBuilder courseId={courseId} />
    </motion.div>
  );
}
