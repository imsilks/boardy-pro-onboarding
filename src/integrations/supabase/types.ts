export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      BoardyPhoneNumber: {
        Row: {
          country: string
          createdAt: string
          id: string
          number: string
          updatedAt: string
        }
        Insert: {
          country: string
          createdAt?: string
          id: string
          number: string
          updatedAt: string
        }
        Update: {
          country?: string
          createdAt?: string
          id?: string
          number?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Call: {
        Row: {
          contactId: string
          createdAt: string
          endedAt: string | null
          endedReason: Database["public"]["Enums"]["EndOfCallReason"] | null
          id: string
          recordingUrl: string | null
          retellCallId: string | null
          startedAt: string | null
          summary: string | null
          transcript: Json | null
          transcriptWithToolCalls: Json | null
          updatedAt: string
          vapiCallId: string | null
        }
        Insert: {
          contactId: string
          createdAt?: string
          endedAt?: string | null
          endedReason?: Database["public"]["Enums"]["EndOfCallReason"] | null
          id: string
          recordingUrl?: string | null
          retellCallId?: string | null
          startedAt?: string | null
          summary?: string | null
          transcript?: Json | null
          transcriptWithToolCalls?: Json | null
          updatedAt: string
          vapiCallId?: string | null
        }
        Update: {
          contactId?: string
          createdAt?: string
          endedAt?: string | null
          endedReason?: Database["public"]["Enums"]["EndOfCallReason"] | null
          id?: string
          recordingUrl?: string | null
          retellCallId?: string | null
          startedAt?: string | null
          summary?: string | null
          transcript?: Json | null
          transcriptWithToolCalls?: Json | null
          updatedAt?: string
          vapiCallId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Call_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Call_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "Call_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Call_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      ColdOutbound: {
        Row: {
          contactId: string
          contactStatus: Database["public"]["Enums"]["OutboundStatus"]
          createdAt: string
          id: string
          prospectId: string
          prospectStatus: Database["public"]["Enums"]["OutboundStatus"]
          updatedAt: string
        }
        Insert: {
          contactId: string
          contactStatus: Database["public"]["Enums"]["OutboundStatus"]
          createdAt?: string
          id: string
          prospectId: string
          prospectStatus: Database["public"]["Enums"]["OutboundStatus"]
          updatedAt: string
        }
        Update: {
          contactId?: string
          contactStatus?: Database["public"]["Enums"]["OutboundStatus"]
          createdAt?: string
          id?: string
          prospectId?: string
          prospectStatus?: Database["public"]["Enums"]["OutboundStatus"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ColdOutbound_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ColdOutbound_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "ColdOutbound_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ColdOutbound_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ColdOutbound_prospectId_fkey"
            columns: ["prospectId"]
            isOneToOne: false
            referencedRelation: "Prospect"
            referencedColumns: ["id"]
          },
        ]
      }
      Community: {
        Row: {
          createdAt: string
          id: string
          name: string
          slug: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          slug: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          slug?: string
          updatedAt?: string
        }
        Relationships: []
      }
      CommunityContact: {
        Row: {
          communityId: string
          contactId: string
          createdAt: string
          id: string
          updatedAt: string
        }
        Insert: {
          communityId: string
          contactId: string
          createdAt?: string
          id: string
          updatedAt: string
        }
        Update: {
          communityId?: string
          contactId?: string
          createdAt?: string
          id?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "CommunityContact_communityId_fkey"
            columns: ["communityId"]
            isOneToOne: false
            referencedRelation: "Community"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CommunityContact_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CommunityContact_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "CommunityContact_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "CommunityContact_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      CommunityVersions: {
        Row: {
          communityId: string | null
          created_at: string
          criteria: Json | null
          dateFilter: string | null
          id: string
          isActive: boolean | null
          promptId: string | null
          promptVersion: string | null
          sheetsId: string | null
          updated_at: string | null
        }
        Insert: {
          communityId?: string | null
          created_at?: string
          criteria?: Json | null
          dateFilter?: string | null
          id: string
          isActive?: boolean | null
          promptId?: string | null
          promptVersion?: string | null
          sheetsId?: string | null
          updated_at?: string | null
        }
        Update: {
          communityId?: string | null
          created_at?: string
          criteria?: Json | null
          dateFilter?: string | null
          id?: string
          isActive?: boolean | null
          promptId?: string | null
          promptVersion?: string | null
          sheetsId?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Contact: {
        Row: {
          createdAt: string
          createdVia: Database["public"]["Enums"]["CreatedVia"] | null
          email: string | null
          firstName: string | null
          fullName: string | null
          hourlyRate: number | null
          id: string
          importedConversation: boolean
          isImported: boolean
          isProUser: boolean
          lastName: string | null
          linkedInMessageThreadId: string | null
          linkedInPrivateId: string | null
          linkedInSlug: string | null
          phone: string | null
          referredById: string | null
          score: number | null
          shouldCall: boolean
          summary: string | null
          teamId: string | null
          unipileConversationId: string | null
          unsubscribed: boolean
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          createdVia?: Database["public"]["Enums"]["CreatedVia"] | null
          email?: string | null
          firstName?: string | null
          fullName?: string | null
          hourlyRate?: number | null
          id: string
          importedConversation?: boolean
          isImported?: boolean
          isProUser?: boolean
          lastName?: string | null
          linkedInMessageThreadId?: string | null
          linkedInPrivateId?: string | null
          linkedInSlug?: string | null
          phone?: string | null
          referredById?: string | null
          score?: number | null
          shouldCall?: boolean
          summary?: string | null
          teamId?: string | null
          unipileConversationId?: string | null
          unsubscribed?: boolean
          updatedAt: string
        }
        Update: {
          createdAt?: string
          createdVia?: Database["public"]["Enums"]["CreatedVia"] | null
          email?: string | null
          firstName?: string | null
          fullName?: string | null
          hourlyRate?: number | null
          id?: string
          importedConversation?: boolean
          isImported?: boolean
          isProUser?: boolean
          lastName?: string | null
          linkedInMessageThreadId?: string | null
          linkedInPrivateId?: string | null
          linkedInSlug?: string | null
          phone?: string | null
          referredById?: string | null
          score?: number | null
          shouldCall?: boolean
          summary?: string | null
          teamId?: string | null
          unipileConversationId?: string | null
          unsubscribed?: boolean
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Contact_referredById_fkey"
            columns: ["referredById"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Contact_referredById_fkey"
            columns: ["referredById"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "Contact_referredById_fkey"
            columns: ["referredById"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Contact_referredById_fkey"
            columns: ["referredById"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Contact_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactCalendar: {
        Row: {
          accessToken: string
          contactId: string
          createdAt: string
          expiresAt: string
          id: string
          provider: string
          providerCalendarId: string
          refreshToken: string
          updatedAt: string
        }
        Insert: {
          accessToken: string
          contactId: string
          createdAt?: string
          expiresAt: string
          id: string
          provider: string
          providerCalendarId: string
          refreshToken: string
          updatedAt: string
        }
        Update: {
          accessToken?: string
          contactId?: string
          createdAt?: string
          expiresAt?: string
          id?: string
          provider?: string
          providerCalendarId?: string
          refreshToken?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ContactCalendar_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactCalendar_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "ContactCalendar_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ContactCalendar_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactFeature: {
        Row: {
          contactId: string
          createdAt: string
          features: Json
          id: string
          promptVersion: string
          updatedAt: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          features: Json
          id: string
          promptVersion: string
          updatedAt: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          features?: Json
          id?: string
          promptVersion?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ContactFeature_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactFeature_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "ContactFeature_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ContactFeature_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactRelationship: {
        Row: {
          contactAId: string
          contactBId: string
          createdAt: string
          id: string
          lastContactedAt: string | null
          relationship: Database["public"]["Enums"]["Relationship"]
          updatedAt: string
        }
        Insert: {
          contactAId: string
          contactBId: string
          createdAt?: string
          id: string
          lastContactedAt?: string | null
          relationship: Database["public"]["Enums"]["Relationship"]
          updatedAt: string
        }
        Update: {
          contactAId?: string
          contactBId?: string
          createdAt?: string
          id?: string
          lastContactedAt?: string | null
          relationship?: Database["public"]["Enums"]["Relationship"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ContactRelationship_contactAId_fkey"
            columns: ["contactAId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactRelationship_contactAId_fkey"
            columns: ["contactAId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "ContactRelationship_contactAId_fkey"
            columns: ["contactAId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ContactRelationship_contactAId_fkey"
            columns: ["contactAId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactRelationship_contactBId_fkey"
            columns: ["contactBId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactRelationship_contactBId_fkey"
            columns: ["contactBId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "ContactRelationship_contactBId_fkey"
            columns: ["contactBId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ContactRelationship_contactBId_fkey"
            columns: ["contactBId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      ContactTag: {
        Row: {
          contactId: string
          createdAt: string
          id: string
          updatedAt: string
          value: Database["public"]["Enums"]["Tag"]
        }
        Insert: {
          contactId: string
          createdAt?: string
          id: string
          updatedAt: string
          value: Database["public"]["Enums"]["Tag"]
        }
        Update: {
          contactId?: string
          createdAt?: string
          id?: string
          updatedAt?: string
          value?: Database["public"]["Enums"]["Tag"]
        }
        Relationships: [
          {
            foreignKeyName: "ContactTag_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ContactTag_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "ContactTag_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ContactTag_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      EmailLabel: {
        Row: {
          createdAt: string
          emailMessageId: string
          id: string
          updatedAt: string
          value: Database["public"]["Enums"]["EmailLabelType"]
        }
        Insert: {
          createdAt?: string
          emailMessageId: string
          id: string
          updatedAt: string
          value: Database["public"]["Enums"]["EmailLabelType"]
        }
        Update: {
          createdAt?: string
          emailMessageId?: string
          id?: string
          updatedAt?: string
          value?: Database["public"]["Enums"]["EmailLabelType"]
        }
        Relationships: [
          {
            foreignKeyName: "EmailLabel_emailMessageId_fkey"
            columns: ["emailMessageId"]
            isOneToOne: false
            referencedRelation: "EmailMessage"
            referencedColumns: ["id"]
          },
        ]
      }
      EmailLinkClickEvent: {
        Row: {
          createdAt: string
          emailMessageId: string
          id: string
          originalLink: string
          recipient: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          emailMessageId: string
          id: string
          originalLink: string
          recipient: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          emailMessageId?: string
          id?: string
          originalLink?: string
          recipient?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "EmailLinkClickEvent_emailMessageId_fkey"
            columns: ["emailMessageId"]
            isOneToOne: false
            referencedRelation: "EmailMessage"
            referencedColumns: ["id"]
          },
        ]
      }
      EmailMessage: {
        Row: {
          body: string
          bouncedAt: string | null
          cc: string[] | null
          createdAt: string
          deliveredAt: string | null
          from: string
          id: string
          inReplyTo: string | null
          messageId: string | null
          openedAt: string | null
          postmarkMessageId: string | null
          rawHtml: string
          role: Database["public"]["Enums"]["Role"]
          subject: string
          to: string[] | null
          updatedAt: string
        }
        Insert: {
          body: string
          bouncedAt?: string | null
          cc?: string[] | null
          createdAt?: string
          deliveredAt?: string | null
          from: string
          id: string
          inReplyTo?: string | null
          messageId?: string | null
          openedAt?: string | null
          postmarkMessageId?: string | null
          rawHtml: string
          role: Database["public"]["Enums"]["Role"]
          subject: string
          to?: string[] | null
          updatedAt: string
        }
        Update: {
          body?: string
          bouncedAt?: string | null
          cc?: string[] | null
          createdAt?: string
          deliveredAt?: string | null
          from?: string
          id?: string
          inReplyTo?: string | null
          messageId?: string | null
          openedAt?: string | null
          postmarkMessageId?: string | null
          rawHtml?: string
          role?: Database["public"]["Enums"]["Role"]
          subject?: string
          to?: string[] | null
          updatedAt?: string
        }
        Relationships: []
      }
      IgnoredEmail: {
        Row: {
          createdAt: string
          email: string
          id: string
          reason: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          reason?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          reason?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      InboundEmail: {
        Row: {
          contactId: string
          createdAt: string
          email: string
          id: string
          updatedAt: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          email: string
          id: string
          updatedAt: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          email?: string
          id?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "InboundEmail_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "InboundEmail_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "InboundEmail_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "InboundEmail_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      IndexVersions: {
        Row: {
          createdAt: string
          id: string
          isActive: boolean
          promptName: string
          promptVersion: string
          shouldIndex: boolean
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          isActive?: boolean
          promptName: string
          promptVersion: string
          shouldIndex?: boolean
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          isActive?: boolean
          promptName?: string
          promptVersion?: string
          shouldIndex?: boolean
          updatedAt?: string
        }
        Relationships: []
      }
      LinkedInMessage: {
        Row: {
          contactId: string
          conversationId: string | null
          createdAt: string
          id: string
          message: string
          messageId: string | null
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Insert: {
          contactId: string
          conversationId?: string | null
          createdAt?: string
          id: string
          message: string
          messageId?: string | null
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Update: {
          contactId?: string
          conversationId?: string | null
          createdAt?: string
          id?: string
          message?: string
          messageId?: string | null
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "LinkedInMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "LinkedInMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "LinkedInMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "LinkedInMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      LinkedinScrape: {
        Row: {
          createdAt: string
          data: Json
          id: string
          linkedinPrivateId: string
          linkedinPublicId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          data: Json
          id: string
          linkedinPrivateId: string
          linkedinPublicId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          data?: Json
          id?: string
          linkedinPrivateId?: string
          linkedinPublicId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Match: {
        Row: {
          callId: string | null
          createdAt: string
          id: string
          introStatus: Database["public"]["Enums"]["IntroStatus"]
          matchContactId: string
          matchStatus: Database["public"]["Enums"]["MatchStatus"]
          matchType: Database["public"]["Enums"]["MatchType"]
          updatedAt: string
          userContactId: string
          userStatus: Database["public"]["Enums"]["MatchStatus"]
        }
        Insert: {
          callId?: string | null
          createdAt?: string
          id: string
          introStatus?: Database["public"]["Enums"]["IntroStatus"]
          matchContactId: string
          matchStatus?: Database["public"]["Enums"]["MatchStatus"]
          matchType: Database["public"]["Enums"]["MatchType"]
          updatedAt: string
          userContactId: string
          userStatus?: Database["public"]["Enums"]["MatchStatus"]
        }
        Update: {
          callId?: string | null
          createdAt?: string
          id?: string
          introStatus?: Database["public"]["Enums"]["IntroStatus"]
          matchContactId?: string
          matchStatus?: Database["public"]["Enums"]["MatchStatus"]
          matchType?: Database["public"]["Enums"]["MatchType"]
          updatedAt?: string
          userContactId?: string
          userStatus?: Database["public"]["Enums"]["MatchStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "Match_callId_fkey"
            columns: ["callId"]
            isOneToOne: false
            referencedRelation: "Call"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_matchContactId_fkey"
            columns: ["matchContactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_matchContactId_fkey"
            columns: ["matchContactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "Match_matchContactId_fkey"
            columns: ["matchContactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Match_matchContactId_fkey"
            columns: ["matchContactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_userContactId_fkey"
            columns: ["userContactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_userContactId_fkey"
            columns: ["userContactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "Match_userContactId_fkey"
            columns: ["userContactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Match_userContactId_fkey"
            columns: ["userContactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      Meeting: {
        Row: {
          createdAt: string
          endedAt: string | null
          id: string
          isProcessed: boolean
          meetingId: string
          recordingUrl: string | null
          startedAt: string | null
          transcript: Json | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          endedAt?: string | null
          id: string
          isProcessed?: boolean
          meetingId: string
          recordingUrl?: string | null
          startedAt?: string | null
          transcript?: Json | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          endedAt?: string | null
          id?: string
          isProcessed?: boolean
          meetingId?: string
          recordingUrl?: string | null
          startedAt?: string | null
          transcript?: Json | null
          updatedAt?: string
        }
        Relationships: []
      }
      MeetingParticipant: {
        Row: {
          contactId: string
          createdAt: string
          email: string
          id: string
          meetingId: string
          updatedAt: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          email: string
          id: string
          meetingId: string
          updatedAt: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          email?: string
          id?: string
          meetingId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "MeetingParticipant_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MeetingParticipant_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "MeetingParticipant_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "MeetingParticipant_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MeetingParticipant_meetingId_fkey"
            columns: ["meetingId"]
            isOneToOne: false
            referencedRelation: "Meeting"
            referencedColumns: ["id"]
          },
        ]
      }
      ProContactSettings: {
        Row: {
          calendarBookingLink: string
          coldOutboundFrequencyHours: number
          contactId: string
          createdAt: string
          id: string
          updatedAt: string
        }
        Insert: {
          calendarBookingLink: string
          coldOutboundFrequencyHours?: number
          contactId: string
          createdAt?: string
          id: string
          updatedAt: string
        }
        Update: {
          calendarBookingLink?: string
          coldOutboundFrequencyHours?: number
          contactId?: string
          createdAt?: string
          id?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ProContactSettings_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProContactSettings_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "ProContactSettings_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ProContactSettings_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      Prospect: {
        Row: {
          contactId: string
          contactNeeds: string | null
          createdAt: string
          email: string | null
          id: string
          justification: string | null
          numResults: number
          profileSummary: string | null
          publicLinkedinId: string | null
          updatedAt: string
        }
        Insert: {
          contactId: string
          contactNeeds?: string | null
          createdAt?: string
          email?: string | null
          id: string
          justification?: string | null
          numResults?: number
          profileSummary?: string | null
          publicLinkedinId?: string | null
          updatedAt: string
        }
        Update: {
          contactId?: string
          contactNeeds?: string | null
          createdAt?: string
          email?: string | null
          id?: string
          justification?: string | null
          numResults?: number
          profileSummary?: string | null
          publicLinkedinId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Prospect_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Prospect_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "Prospect_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Prospect_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      QueryLog: {
        Row: {
          callId: string | null
          contactId: string
          contactScore: number | null
          createdAt: string
          id: string
          percentile: number | null
          query: string | null
          results: Json
          updatedAt: string
        }
        Insert: {
          callId?: string | null
          contactId: string
          contactScore?: number | null
          createdAt?: string
          id: string
          percentile?: number | null
          query?: string | null
          results: Json
          updatedAt: string
        }
        Update: {
          callId?: string | null
          contactId?: string
          contactScore?: number | null
          createdAt?: string
          id?: string
          percentile?: number | null
          query?: string | null
          results?: Json
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "QueryLog_callId_fkey"
            columns: ["callId"]
            isOneToOne: false
            referencedRelation: "Call"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QueryLog_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QueryLog_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "QueryLog_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "QueryLog_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      SocialMediaImpact: {
        Row: {
          createdAt: string
          id: string
          linkedinSlug: string
          points: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          linkedinSlug: string
          points: number
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          linkedinSlug?: string
          points?: number
          updatedAt?: string
        }
        Relationships: []
      }
      Team: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      TextMessage: {
        Row: {
          contactId: string
          createdAt: string
          id: string
          message: string
          messageId: string
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          id: string
          message: string
          messageId: string
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          id?: string
          message?: string
          messageId?: string
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "TextMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TextMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "TextMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "TextMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      Thread: {
        Row: {
          contactId: string
          createdAt: string
          id: string
          introMatchId: string | null
          matchMatchId: string | null
          outboundContactId: string | null
          outboundProspectId: string | null
          threadType: Database["public"]["Enums"]["ThreadType"] | null
          updatedAt: string
          userMatchId: string | null
        }
        Insert: {
          contactId: string
          createdAt?: string
          id: string
          introMatchId?: string | null
          matchMatchId?: string | null
          outboundContactId?: string | null
          outboundProspectId?: string | null
          threadType?: Database["public"]["Enums"]["ThreadType"] | null
          updatedAt: string
          userMatchId?: string | null
        }
        Update: {
          contactId?: string
          createdAt?: string
          id?: string
          introMatchId?: string | null
          matchMatchId?: string | null
          outboundContactId?: string | null
          outboundProspectId?: string | null
          threadType?: Database["public"]["Enums"]["ThreadType"] | null
          updatedAt?: string
          userMatchId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Thread_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Thread_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "Thread_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Thread_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Thread_introMatchId_fkey"
            columns: ["introMatchId"]
            isOneToOne: false
            referencedRelation: "Match"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Thread_matchMatchId_fkey"
            columns: ["matchMatchId"]
            isOneToOne: false
            referencedRelation: "Match"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Thread_outboundContactId_fkey"
            columns: ["outboundContactId"]
            isOneToOne: false
            referencedRelation: "ColdOutbound"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Thread_outboundProspectId_fkey"
            columns: ["outboundProspectId"]
            isOneToOne: false
            referencedRelation: "ColdOutbound"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Thread_userMatchId_fkey"
            columns: ["userMatchId"]
            isOneToOne: false
            referencedRelation: "Match"
            referencedColumns: ["id"]
          },
        ]
      }
      ThreadMessage: {
        Row: {
          createdAt: string
          messageId: string
          threadId: string
        }
        Insert: {
          createdAt?: string
          messageId: string
          threadId: string
        }
        Update: {
          createdAt?: string
          messageId?: string
          threadId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ThreadMessage_messageId_fkey"
            columns: ["messageId"]
            isOneToOne: false
            referencedRelation: "EmailMessage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ThreadMessage_threadId_fkey"
            columns: ["threadId"]
            isOneToOne: false
            referencedRelation: "Thread"
            referencedColumns: ["id"]
          },
        ]
      }
      UnipileLinkedInChat: {
        Row: {
          contactId: string
          createdAt: string
          id: string
          providerChatId: string
          unipileAccountId: string
          unipileChatId: string
          updatedAt: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          id: string
          providerChatId: string
          unipileAccountId: string
          unipileChatId: string
          updatedAt: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          id?: string
          providerChatId?: string
          unipileAccountId?: string
          unipileChatId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "UnipileLinkedInChat_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UnipileLinkedInChat_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "UnipileLinkedInChat_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "UnipileLinkedInChat_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
      UnipileLinkedInMessage: {
        Row: {
          contactId: string
          createdAt: string
          hasBeenProcessed: boolean
          id: string
          message: string
          providerMessageId: string
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          hasBeenProcessed?: boolean
          id: string
          message: string
          providerMessageId: string
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          hasBeenProcessed?: boolean
          id?: string
          message?: string
          providerMessageId?: string
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "UnipileLinkedInMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UnipileLinkedInMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "UnipileLinkedInMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "UnipileLinkedInMessage_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ContactScores: {
        Row: {
          contactId: string | null
          goodwillScore: number | null
          hourlyRateUsd: number | null
          prestigeScore: number | null
          promptVersion: string | null
          scoreCreatedAt: string | null
          scoreUpdatedAt: string | null
        }
        Relationships: []
      }
      Interaction: {
        Row: {
          callComplete: boolean | null
          cohort: string | null
          contactId: string | null
          createdAt: string | null
          direction: string | null
          id: string | null
          interactionId: string | null
          is_internal: boolean | null
          messages: Json | null
          tenure_weeks: number | null
          type: string | null
          volume: number | null
        }
        Relationships: []
      }
      MatchingModelFeatures: {
        Row: {
          accepted_count: number | null
          email_engagement_count: number | null
          engagement_count: number | null
          hours_since_email_engagement: number | null
          hours_since_engagement: number | null
          ignore_count: number | null
          last_open: boolean | null
          letdown_count: number | null
          open_rate: number | null
          referral_count: number | null
          requeststatus: Database["public"]["Enums"]["MatchStatus"] | null
          score: number | null
          success_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
      RandomContact: {
        Row: {
          createdAt: string | null
          createdVia: Database["public"]["Enums"]["CreatedVia"] | null
          email: string | null
          firstName: string | null
          fullName: string | null
          hourlyRate: number | null
          id: string | null
          importedConversation: boolean | null
          isImported: boolean | null
          isProUser: boolean | null
          lastName: string | null
          linkedInMessageThreadId: string | null
          linkedInPrivateId: string | null
          linkedInProfile: Json | null
          linkedInSlug: string | null
          phone: string | null
          referredById: string | null
          score: number | null
          shouldCall: boolean | null
          summary: string | null
          teamId: string | null
          unipileConversationId: string | null
          unsubscribed: boolean | null
          updatedAt: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Contact_referredById_fkey"
            columns: ["referredById"]
            isOneToOne: false
            referencedRelation: "Contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Contact_referredById_fkey"
            columns: ["referredById"]
            isOneToOne: false
            referencedRelation: "ContactScores"
            referencedColumns: ["contactId"]
          },
          {
            foreignKeyName: "Contact_referredById_fkey"
            columns: ["referredById"]
            isOneToOne: false
            referencedRelation: "MatchingModelFeatures"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Contact_referredById_fkey"
            columns: ["referredById"]
            isOneToOne: false
            referencedRelation: "RandomContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Contact_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
      }
      UserInteractions: {
        Row: {
          accepted_matches: number | null
          callComplete: boolean | null
          cohort: string | null
          contactId: string | null
          interactions: Json | null
          total_intros: number | null
          total_matches: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_first_time_transcripts: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          transcript: Json
        }[]
      }
      get_hourly_contact_stats: {
        Args: {
          dummy_param?: Json
        }
        Returns: Json
      }
      refresh_contact_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      CreatedVia:
        | "LINKEDIN_DM"
        | "COLD_EMAIL"
        | "COLD_CALL"
        | "EMAIL_REFERRAL"
        | "COLD_OUTBOUND"
      EmailLabelType:
        | "MATCH_REMINDER"
        | "REFERRAL_REQUEST_AFTER_INTRO"
        | "REFERRED_USER_ONBOARDING_REMINDER"
      EndOfCallReason:
        | "COMPLETE"
        | "VOICEMAIL"
        | "LINE_DROPPED"
        | "CALLBACK_REQUESTED"
        | "FAILED"
        | "WRONG_NUMBER"
      IntroStatus: "NONE" | "INTRO_SENT" | "INTRO_REJECTED" | "INTRO_STALE"
      MatchStatus:
        | "NONE"
        | "REQUEST_EMAIL_SENT"
        | "REQUEST_ACCEPTED"
        | "REQUEST_REJECTED"
        | "FOLLOW_UP_SENT"
      MatchType: "ON_CALL" | "EMAIL"
      OutboundStatus:
        | "NONE"
        | "PROPOSED"
        | "ACCEPTED"
        | "REJECTED"
        | "FOLLOW_UP"
        | "COMPLETE"
      Relationship: "CALENDAR" | "LINKEDIN"
      Role: "ASSISTANT" | "USER" | "SYSTEM" | "TOOL"
      Tag:
        | "INVITED_TO_CONNECTOR"
        | "SCHEDULE_WEEKLY_CALL"
        | "ADDED_POSITION_ON_LINKEDIN"
        | "JOINED_WHATSAPP_GROUP"
        | "INVESTOR"
      ThreadType: "REFERRAL_REQUEST"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
