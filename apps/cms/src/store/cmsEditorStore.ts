"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Timeline = { start: string; end: string } | null;

type CasePoint = { label: string; text: string };

type CaseStudyImage = {
  url: string;
  isPrimary?: boolean;
  pendingFile?: File;
};

type ProjectMemberLink = { memberId: string; roleLabel: string | null };
type MemberProjectLink = { projectId: string; roleLabel: string | null };

export type CmsProjectDraft = {
  id: string;
  slug: string;
  sourceLocale: "vi" | "en";
  title: string;
  summary: string | null;
  coverUrl: string | null;
  demoUrl: string | null;
  tags: string[];
  timeline: Timeline;
  caseStudy: {
    kicker?: string;
    problem?: string;
    solution?: string;
    result?: string;
    points?: CasePoint[];
    images?: CaseStudyImage[];
  } | null;
  memberProjects?: ProjectMemberLink[];
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
};

export type CmsMemberDraft = {
  id: string;
  slug: string;
  sourceLocale: "vi" | "en";
  name: string;
  role: string | null;
  bio: string | null;
  avatarUrl: string | null;
  cvUrl: string | null;
  socials: { platform: string; url: string }[];
  memberProjects?: MemberProjectLink[];
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
};

type CmsEditorState = {
  projectDrafts: Record<string, CmsProjectDraft>;
  memberDrafts: Record<string, CmsMemberDraft>;
  setProjectDraft: (id: string, draft: CmsProjectDraft) => void;
  updateProjectDraft: (id: string, patch: Partial<CmsProjectDraft>) => void;
  clearProjectDraft: (id: string) => void;
  setMemberDraft: (id: string, draft: CmsMemberDraft) => void;
  updateMemberDraft: (id: string, patch: Partial<CmsMemberDraft>) => void;
  clearMemberDraft: (id: string) => void;
  resetEditorState: () => void;
};

export const useCmsEditorStore = create<CmsEditorState>()(
  devtools((set) => ({
    projectDrafts: {},
    memberDrafts: {},
    setProjectDraft: (id, draft) => set((state) => ({ projectDrafts: { ...state.projectDrafts, [id]: draft } }), false, "cmsEditor/setProjectDraft"),
    updateProjectDraft: (id, patch) => set((state) => ({ projectDrafts: { ...state.projectDrafts, [id]: { ...state.projectDrafts[id], ...patch } } }), false, "cmsEditor/updateProjectDraft"),
    clearProjectDraft: (id) => set((state) => {
      const next = { ...state.projectDrafts };
      delete next[id];
      return { projectDrafts: next };
    }, false, "cmsEditor/clearProjectDraft"),
    setMemberDraft: (id, draft) => set((state) => ({ memberDrafts: { ...state.memberDrafts, [id]: draft } }), false, "cmsEditor/setMemberDraft"),
    updateMemberDraft: (id, patch) => set((state) => ({ memberDrafts: { ...state.memberDrafts, [id]: { ...state.memberDrafts[id], ...patch } } }), false, "cmsEditor/updateMemberDraft"),
    clearMemberDraft: (id) => set((state) => {
      const next = { ...state.memberDrafts };
      delete next[id];
      return { memberDrafts: next };
    }, false, "cmsEditor/clearMemberDraft"),
    resetEditorState: () => set({ projectDrafts: {}, memberDrafts: {} }, false, "cmsEditor/resetEditorState"),
  })),
);
