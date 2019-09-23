-- SeMarket SQL Server database setup script

-- Local Environment Only

/*
create database semarket
go

create login [dev] with password='dev', default_database=[master], default_language=[us_english], check_expiration=off, check_policy=off
go

create user [dev] for login [dev] with default_schema=[dbo]
go

alter server role [sysadmin] add member [dev]
go

alter server role [securityadmin] add member [dev]
go

alter server role [serveradmin] add member [dev]
go

alter server role [setupadmin] add member [dev]
go

alter server role [processadmin] add member [dev]
go

alter server role [diskadmin] add member [dev]
go

alter server role [dbcreator] add member [dev]
go

alter server role [bulkadmin] add member [dev]
go
CREATE USER [dev] FOR LOGIN [dev] WITH DEFAULT_SCHEMA=[dbo]
GO
use [semarket]
go
*/

if not exists ( select * from sys.objects where object_id = object_ID( N'[user]' ) and type in ( N'U' ) )
	begin
	  create table [user]
	  (
		[internal_id] [bigint] identity(1,1) not null,
		[id] [nvarchar](MAX)  null,
		[name] [nvarchar](MAX) null,
		[role] [nvarchar](MAX) null,
		[location] [nvarchar](MAX) null,
		[timestamp] [datetime2](7) not null,
		constraint [PK_user] primary key clustered ( [internal_id] asc )
		with
		(
			pad_index = off,
			statistics_norecompute = off,
			ignore_dup_key = off,
			allow_row_locks = on,
			allow_page_locks = on
		) on [Primary]
	  ) on [Primary]
	end
go

if not exists ( select * from sys.objects where object_id = object_ID( N'[wallet]' ) and type in ( N'U' ) )
	begin
	  create table [wallet]
	  (
		[internal_id] [bigint] identity(1,1) not null,
		[seed] [nvarchar](MAX) null,
		[address] [nvarchar](MAX)  null,
		[keyIndex] bigint  null,
		[balance] bigint  null,
		[timestamp] [datetime2](7) not null,
		constraint [PK_wallet] primary key clustered ( [internal_id] asc )
		with
		(
			pad_index = off,
			statistics_norecompute = off,
			ignore_dup_key = off,
			allow_row_locks = on,
			allow_page_locks = on
		) on [Primary]
	  ) on [Primary]
	end
go

if not exists ( select * from sys.objects where object_id = object_ID( N'[mam]' ) and type in ( N'U' ) )
	begin
	  create table [mam]
	  (
		[internal_id] [bigint] identity(1,1) not null,
		[id] [nvarchar](MAX)  null,
		[root] [nvarchar](MAX)  null,
		[seed] [nvarchar](MAX)  null,
		[next_root] [nvarchar](MAX)  null,
		[side_key] [nvarchar](MAX)  null,
		[start] bigint not null,
		[timestamp] [datetime2](7) not null,
		constraint [PK_mam] primary key clustered ( [internal_id] asc )
		with
		(
			pad_index = off,
			statistics_norecompute = off,
			ignore_dup_key = off,
			allow_row_locks = on,
			allow_page_locks = on
		) on [Primary]
	  ) on [Primary]
	end
go

if not exists ( select * from sys.objects where object_id = object_ID( N'[did]' ) and type in ( N'U' ) )
	begin
	  create table [did]
	  (
		[internal_id] [bigint] identity(1,1) not null,
		[root] [nvarchar](MAX) null,
		[privateKey] [nvarchar](MAX)  null,
		[seed] [nvarchar](MAX)  null,
		[next_root] [nvarchar](MAX)  null,
		[start] bigint not null,
		[timestamp] [datetime2](7) not null,
		constraint [PK_did] primary key clustered ( [internal_id] asc )
		with
		(
			pad_index = off,
			statistics_norecompute = off,
			ignore_dup_key = off,
			allow_row_locks = on,
			allow_page_locks = on
		) on [Primary]
	  ) on [Primary]
	end
go



if not exists ( select * from sys.objects where object_id = object_ID( N'[did]' ) and type in ( N'U' ) )
	begin
	  create table [did]
	  (
		[internal_id] [bigint] identity(1,1) not null,
		[root] [nvarchar](MAX) null,
		[privateKey] [nvarchar](MAX)  null,
		[seed] [nvarchar](MAX)  null,
		[next_root] [nvarchar](MAX)  null,
		[start] bigint not null,
		[timestamp] [datetime2](7) not null,
		constraint [PK_did] primary key clustered ( [internal_id] asc )
		with
		(
			pad_index = off,
			statistics_norecompute = off,
			ignore_dup_key = off,
			allow_row_locks = on,
			allow_page_locks = on
		) on [Primary]
	  ) on [Primary]
	end
go

if not exists ( select * from sys.objects where object_id = object_ID( N'[credential]' ) and type in ( N'U' ) )
	begin
	  create table [credential]
	  (
		[internal_id] [bigint] IDENTITY(1,1) NOT NULL,
		[address] [nvarchar](max) NULL,
		[value] [bigint] NULL,
		[timestamp] [datetime2](7) NOT NULL,
		constraint [PK_credential] primary key clustered ( [internal_id] asc )
		with
		(
			pad_index = off,
			statistics_norecompute = off,
			ignore_dup_key = off,
			allow_row_locks = on,
			allow_page_locks = on
		) on [Primary]
	  ) on [Primary]
	end
go

if not exists ( select * from sys.objects where object_id = object_ID( N'[data]' ) and type in ( N'U' ) )
	begin
	  create table [data]
	  (
		[internal_id] [bigint] IDENTITY(1,1) NOT NULL,
		[id] [nvarchar](max) NULL,
		[deviceId] [nvarchar](max) NULL,
		[userId] [nvarchar](max) NULL,
		[schema] [nvarchar](max) NULL,
		[timestamp] [datetime2](7) NOT NULL,
		constraint [PK_data] primary key clustered ( [internal_id] asc )
		with
		(
			pad_index = off,
			statistics_norecompute = off,
			ignore_dup_key = off,
			allow_row_locks = on,
			allow_page_locks = on
		) on [Primary]
	  ) on [Primary]
	end
go

if not exists ( select * from sys.objects where object_id = object_ID( N'[credential]' ) and type in ( N'U' ) )
	begin
	  create table [credential]
	  (
		[internal_id] [bigint] IDENTITY(1,1) NOT NULL,
		[id] [nvarchar](max) NULL,
		[credential] [nvarchar](max) NULL,
		[timestamp] [datetime2](7) NOT NULL,
		constraint [PK_credential] primary key clustered ( [internal_id] asc )
		with
		(
			pad_index = off,
			statistics_norecompute = off,
			ignore_dup_key = off,
			allow_row_locks = on,
			allow_page_locks = on
		) on [Primary]
	  ) on [Primary]
	end
go


if not exists ( select * from dbo.sysobjects where id = object_id( N'[dbo].[data]' ) and type = 'D' )
begin
  alter table [dbo].[data] add constraint [df_data_timestamp] default ( getdate() ) for [timestamp]
end
go

if not exists ( select * from dbo.sysobjects where id = object_id( N'[dbo].[did]' ) and type = 'D' )
begin
  alter table [dbo].[did] add constraint [df_did_timestamp] default ( getdate() ) for [timestamp]
end
go

if not exists ( select * from dbo.sysobjects where id = object_id( N'[dbo].[mam]' ) and type = 'D' )
begin
  alter table [dbo].[mam] add constraint [df_mam_timestamp] default ( getdate() ) for [timestamp]
end
go

if not exists ( select * from dbo.sysobjects where id = object_id( N'[dbo].[credential]' ) and type = 'D' )
begin
  alter table [dbo].[credential] add constraint [df_credential_timestamp] default ( getdate() ) for [timestamp]
end
go

if not exists ( select * from dbo.sysobjects where id = object_id( N'[dbo].[user]' ) and type = 'D' )
begin
  alter table [dbo].[user] add constraint [df_user_timestamp] default ( getdate() ) for [timestamp]
end
go

if not exists ( select * from dbo.sysobjects where id = object_id( N'[dbo].[wallet]' ) and type = 'D' )
begin
  alter table [dbo].[wallet] add constraint [df_wallet_timestamp] default ( getdate() ) for [timestamp]
end
go

if not exists ( select * from dbo.sysobjects where id = object_id( N'[dbo].[credential]' ) and type = 'D' )
begin
  alter table [dbo].[credential] add constraint [df_credential_timestamp] default ( getdate() ) for [timestamp]
end
go