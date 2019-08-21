-- SeMarket SQL Server database setup script

-- Local Environment Only

/*
create database semarket
go
use [semarket]
go
*/

if not exists ( select * from sys.objects where object_id = object_ID( N'[user]' ) and type in ( N'U' ) )
	begin
	  create table [user]
	  (
		[internal_id] [bigint] identity(1,1) not null,
		[id] [nvarchar](MAX) not null,
		[name] [nvarchar](MAX) not null,
		[role] [nvarchar](MAX) not null,
		[location] [nvarchar](MAX) not null,
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
		[seed] [nvarchar](MAX) not null,
		[address] [nvarchar](MAX) not null,
		[keyIndex] bigint not null,
		[balance] bigint not null,
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
		[id] [nvarchar](MAX) not null,
		[root] [nvarchar](MAX) not null,
		[seed] [nvarchar](MAX) not null,
		[next_root] [nvarchar](MAX) not null,
		[side_key] [nvarchar](MAX) not null,
		[start] bigint not null,
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
		[root] [nvarchar](MAX) not null,
		[privateKey] [nvarchar](MAX) not null,
		[seed] [nvarchar](MAX) not null,
		[next_root] [nvarchar](MAX) not null,
		[start] bigint not null,
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


