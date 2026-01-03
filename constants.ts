
import { Symptom } from './types';

export const PHYSICAL_SYMPTOMS: Symptom[] = [
  { id: 'headache_hoop', label: '紧箍咒头痛', icon: '👑' },
  { id: 'muscle_pain', label: '挑担腰酸背痛', icon: '🎒' },
  { id: 'eye_strain', label: '火眼金睛干涩', icon: '👁️' },
  { id: 'fatigue', label: '长途跋涉劳累', icon: '🏃' },
  { id: 'stomach_ache', label: '误食不明野果', icon: '🍎' },
  { id: 'cold', label: '深夜受凉风寒', icon: '❄️' }
];

export const MENTAL_SYMPTOMS: Symptom[] = [
  { id: 'demon_anxiety', label: '见妖怪即焦虑', icon: '👿' },
  { id: 'home_sick', label: '思乡情切', icon: '🏠' },
  { id: 'anger_management', label: '动不动想抡棒子', icon: '🥖' },
  { id: 'laziness', label: '贪吃好色懒惰', icon: '🐷' },
  { id: 'compassion_fatigue', label: '慈悲过度抑郁', icon: '🙏' },
  { id: 'ego_clash', label: '师徒矛盾不和', icon: '🗣️' }
];

export const CHARACTERS = [
  { 
    name: '唐三藏', 
    role: '师傅', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/a08b87d6277f9e2f070868f0f37bb324b8997380f745',
    color: '#eab308'
  },
  { 
    name: '孙悟空', 
    role: '大师兄', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/023b5bb5c9ea15ce111867bab2003af33a87b244f77c',
    color: '#ef4444'
  },
  { 
    name: '猪八戒', 
    role: '二师兄', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/83025aafa40f4bfb1bbd1349f8076e0392452097f745', 
    color: '#f472b6'
  },
  { 
    name: '沙悟净', 
    role: '三师弟', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/838ba61ea8d3fd1f269389f43a4e251f95ca5f96f745',
    color: '#3b82f6'
  }
];

export const GATEKEEPER_LABELS = [
  "寻医问药", "仙医指路", "大圣归来", "八戒寻踪", "悟净担挑",
  "如来点化", "观音洒水", "老君炼丹", "龙王借宝", "土地显灵",
  "御马监察", "蟠桃盛会", "广寒宫影", "天蓬下凡", "真经在此"
];
