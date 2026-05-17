export type ReadmeTemplate = "basic" | "saas" | "open-source" | "portfolio";

export interface ReadmeFormData {
  projectName: string;
  description: string;
  features: string;
  installation: string;
  usage: string;
  techStack: string;
  license: string;
  author: string;
  githubUrl: string;
}

export interface TemplateOption {
  id: ReadmeTemplate;
  label: string;
  description: string;
}

export interface BadgeDefinition {
  label: string;
  token: string;
  color: string;
  logo: string;
}
