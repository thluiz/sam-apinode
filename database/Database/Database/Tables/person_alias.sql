CREATE TABLE [dbo].[person_alias] (
    [id]          INT            IDENTITY (1, 1) NOT NULL,
    [person_id]   INT            NOT NULL,
    [alias]       VARCHAR (100)  NULL,
    [principal]   BIT            DEFAULT ((0)) NOT NULL,
    [kungfu_name] BIT            DEFAULT ((0)) NOT NULL,
    [ideograms]   NVARCHAR (100) NULL,
    [initials]    VARCHAR (8)    NULL,
    CONSTRAINT [PK__person_a__3213E83F49303ECE] PRIMARY KEY CLUSTERED ([id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [idx_person_kfname]
    ON [dbo].[person_alias]([person_id] ASC, [kungfu_name] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_person_alias_principal]
    ON [dbo].[person_alias]([person_id] ASC, [principal] ASC);

