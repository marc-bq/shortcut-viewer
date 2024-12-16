export type Story = {
    app_url:                     string;
    archived:                    boolean;
    blocked:                     boolean;
    blocker:                     boolean;
    branches:                    Branch[];
    comments:                    Comment[];
    commits:                     Commit[];
    completed:                   boolean;
    completed_at:                Date;
    completed_at_override:       Date;
    created_at:                  Date;
    custom_fields:               CustomField[];
    cycle_time:                  number;
    deadline:                    Date;
    description:                 string;
    entity_type:                 string;
    epic_id:                     number;
    estimate:                    number;
    external_id:                 string;
    external_links:              any[];
    files:                       File[];
    follower_ids:                string[];
    group_id:                    string;
    group_mention_ids:           string[];
    id:                          number;
    iteration_id:                number;
    label_ids:                   number[];
    labels:                      Label[];
    lead_time:                   number;
    linked_files:                File[];
    member_mention_ids:          string[];
    mention_ids:                 string[];
    moved_at:                    Date;
    name:                        string;
    owner_ids:                   string[];
    position:                    number;
    previous_iteration_ids:      number[];
    project_id:                  number;
    pull_requests:               PullRequest[];
    requested_by_id:             string;
    started:                     boolean;
    started_at:                  Date;
    started_at_override:         Date;
    stats:                       Stats;
    story_links:                 StoryLink[];
    story_template_id:           string;
    story_type:                  string;
    synced_item:                 SyncedItem;
    tasks:                       Task[];
    unresolved_blocker_comments: number[];
    updated_at:                  Date;
    workflow_id:                 number;
    workflow_state_id:           number;
}

export type Branch = {
    created_at:        Date;
    deleted:           boolean;
    entity_type:       string;
    id:                number;
    merged_branch_ids: number[];
    name:              string;
    persistent:        boolean;
    pull_requests:     PullRequest[];
    repository_id:     number;
    updated_at:        Date;
    url:               string;
}

export type PullRequest = {
    branch_id:               number;
    branch_name:             string;
    build_status:            string;
    closed:                  boolean;
    created_at:              Date;
    draft:                   boolean;
    entity_type:             string;
    has_overlapping_stories: boolean;
    id:                      number;
    merged:                  boolean;
    num_added:               number;
    num_commits:             number;
    num_modified:            number;
    num_removed:             number;
    number:                  number;
    overlapping_stories:     number[];
    repository_id:           number;
    review_status:           string;
    target_branch_id:        number;
    target_branch_name:      string;
    title:                   string;
    updated_at:              Date;
    url:                     string;
    vcs_labels:              VcsLabel[];
}

export type VcsLabel = {
    color:       string;
    description: string;
    entity_type: string;
    id:          number;
    name:        string;
}

export type Comment = {
    app_url:            string;
    author_id:          string;
    blocker:            boolean;
    created_at:         Date;
    deleted:            boolean;
    entity_type:        string;
    external_id:        string;
    group_mention_ids:  string[];
    id:                 number;
    linked_to_slack:    boolean;
    member_mention_ids: string[];
    mention_ids:        string[];
    parent_id:          number;
    position:           number;
    story_id:           number;
    text:               string;
    unblocks_parent:    boolean;
    updated_at:         Date;
}

export type Commit = {
    author_email:    string;
    author_id:       string;
    author_identity: AuthorIdentity;
    created_at:      Date;
    entity_type:     string;
    hash:            string;
    id:              number;
    message:         string;
    repository_id:   number;
    timestamp:       Date;
    updated_at:      Date;
    url:             string;
}

export type AuthorIdentity = {
    entity_type: string;
    name:        string;
    type:        string;
}

export type CustomField = {
    field_id: string;
    value:    string;
    value_id: string;
}

export type File = {
    content_type:       string;
    created_at:         Date;
    description:        string;
    entity_type:        string;
    external_id?:       string;
    filename?:          string;
    group_mention_ids:  string[];
    id:                 number;
    member_mention_ids: string[];
    mention_ids:        string[];
    name:               string;
    size:               number;
    story_ids:          number[];
    thumbnail_url:      string;
    updated_at:         Date;
    uploader_id:        string;
    url:                string;
    type?:              string;
}

export type Label = {
    app_url:     string;
    archived:    boolean;
    color:       string;
    created_at:  Date;
    description: string;
    entity_type: string;
    external_id: string;
    id:          number;
    name:        string;
    updated_at:  Date;
}

export type Stats = {
    num_related_documents: number;
}

export type StoryLink = {
    created_at:  Date;
    entity_type: string;
    id:          number;
    object_id:   number;
    subject_id:  number;
    type:        string;
    updated_at:  Date;
    verb:        string;
}

export type SyncedItem = {
    external_id: string;
    url:         string;
}

export type Task = {
    complete:           boolean;
    completed_at:       Date;
    created_at:         Date;
    description:        string;
    entity_type:        string;
    external_id:        string;
    group_mention_ids:  string[];
    id:                 number;
    member_mention_ids: string[];
    mention_ids:        string[];
    owner_ids:          string[];
    position:           number;
    story_id:           number;
    updated_at:         Date;
}
