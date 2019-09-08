CREATE TABLE [dbo].[person] (
    [id]                          INT            IDENTITY (1, 1) NOT NULL,
    [name]                        VARCHAR (250)  NULL,
    [branch_id]                   INT            NULL,
    [program_id]                  INT            NULL,
    [domain_id]                   INT            NULL,
    [scheduling_status]           INT            DEFAULT ((0)) NOT NULL,
    [financial_status]            INT            DEFAULT ((0)) NOT NULL,
    [avatar_img]                  VARCHAR (80)   NULL,
    [free_financial]              BIT            DEFAULT ((0)) NOT NULL,
    [free_scheduling]             BIT            DEFAULT ((0)) NOT NULL,
    [comunication_status]         BIT            DEFAULT ((0)) NOT NULL,
    [comunication_description]    VARCHAR (300)  NULL,
    [admission_date]              DATE           NULL,
    [birth_date]                  DATE           NULL,
    [is_disciple]                 BIT            DEFAULT ((0)) NOT NULL,
    [is_active_member]            BIT            DEFAULT ((0)) NOT NULL,
    [is_leaving]                  BIT            DEFAULT ((0)) NOT NULL,
    [is_director]                 BIT            DEFAULT ((0)) NOT NULL,
    [baaisi_date]                 DATE           NULL,
    [family_id]                   INT            NULL,
    [is_inactive_member]          BIT            DEFAULT ((0)) NOT NULL,
    [data_status_description]     VARCHAR (MAX)  NULL,
    [data_status]                 INT            DEFAULT ((0)) NOT NULL,
    [issues_level]                INT            DEFAULT ((0)) NOT NULL,
    [has_birthday_this_month]     BIT            DEFAULT ((0)) NOT NULL,
    [updated_at]                  DATETIME       DEFAULT (getutcdate()) NOT NULL,
    [is_manager]                  BIT            DEFAULT ((0)) NOT NULL,
    [is_operator]                 BIT            DEFAULT ((0)) NOT NULL,
    [enrollment_date]             DATE           NULL,
    [destiny_family_id]           INT            NULL,
    [identification]              VARCHAR (50)   NULL,
    [identification2]             VARCHAR (50)   NULL,
    [passport]                    VARCHAR (50)   NULL,
    [occupation]                  VARCHAR (100)  NULL,
    [passport_expiration_date]    DATE           NULL,
    [is_interested]               BIT            DEFAULT ((0)) NOT NULL,
    [next_incident_id]            INT            NULL,
    [is_service_provider]         BIT            DEFAULT ((0)) NOT NULL,
    [is_associated_with_member]   BIT            DEFAULT ((0)) NOT NULL,
    [default_page_id]             INT            CONSTRAINT [df_person_default_page_id] DEFAULT ((5)) NOT NULL,
    [is_external_member]          BIT            DEFAULT ((0)) NOT NULL,
    [age]                         INT            NULL,
    [scheduling_description]      VARCHAR (MAX)  NULL,
    [financial_description]       VARCHAR (MAX)  NULL,
    [alias]                       VARCHAR (15)   NULL,
    [contracted_p1_sessions]      INT            DEFAULT ((0)) NOT NULL,
    [p1_sessions_current_month]   INT            DEFAULT ((0)) NOT NULL,
    [current_p2_session]          INT            DEFAULT ((0)) NOT NULL,
    [expected_p2_session]         INT            DEFAULT ((0)) NOT NULL,
    [p2_cycle_start_date]         DATE           NULL,
    [pinned_comment_count]        INT            DEFAULT ((0)) NOT NULL,
    [offering_status_description] VARCHAR (MAX)  NULL,
    [offering_status]             INT            DEFAULT ((0)) NOT NULL,
    [last_incident_id]            INT            NULL,
    [person_responsible_id]       INT            NULL,
    [shirt_size]                  VARCHAR (3)    NULL,
    [gender]                      VARCHAR (1)    NULL,
    [pants_size]                  VARCHAR (3)    NULL,
    [avatar_md]                   BIT            DEFAULT ((0)) NOT NULL,
    [avatar_sm]                   BIT            DEFAULT ((0)) NOT NULL,
    [avatar_esm]                  BIT            DEFAULT ((0)) NOT NULL,
    [salt]                        NVARCHAR (300) NULL,
    [password]                    NVARCHAR (150) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC) WITH (FILLFACTOR = 100),
    CONSTRAINT [FK_Person_Branch] FOREIGN KEY ([branch_id]) REFERENCES [dbo].[branch] ([id]),
    CONSTRAINT [FK_Person_Domain] FOREIGN KEY ([domain_id]) REFERENCES [dbo].[domain] ([id]),
    CONSTRAINT [fk_person_family] FOREIGN KEY ([family_id]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [FK_person_program] FOREIGN KEY ([program_id]) REFERENCES [dbo].[program] ([id])
);














GO
CREATE NONCLUSTERED INDEX [idx_person_active_member]
    ON [dbo].[person]([is_active_member] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_person_branch_program_domain]
    ON [dbo].[person]([branch_id] ASC, [program_id] ASC, [domain_id] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_person_updated_at]
    ON [dbo].[person]([updated_at] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_person_Interested]
    ON [dbo].[person]([is_interested] ASC);

