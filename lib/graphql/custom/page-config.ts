import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import gql from 'graphql-tag';

import { PageConfigOwnerType } from '$lib/graphql/generated/backend/graphql';

export type GetPageConfigWithCustomCodeQuery = {
  __typename?: 'Query';
  getPageConfig?: any | null;
};

export type GetPageConfigWithCustomCodeQueryVariables = {
  id?: string | null;
  ownerType?: PageConfigOwnerType | null;
  ownerId?: string | null;
};

export const GetPageConfigWithCustomCodeDocument = gql`
  query GetPageConfigWithCustomCode($id: MongoID, $ownerType: PageConfigOwnerType, $ownerId: MongoID) {
    getPageConfig(_id: $id, owner_type: $ownerType, owner_id: $ownerId) {
      _id
      name
      description
      owner_id
      owner_type
      status
      version
      published_version
      thumbnail_url
      created_at
      created_by
      last_edited_by
      locked_at
      locked_by
      template_id
      template_version_installed
      space_id
      theme {
        type
        mode
        colors {
          accent
        }
        background {
          type
          value
        }
        fonts {
          title {
            family
          }
          body {
            family
          }
        }
        effects {
          type
          value
        }
        css_variables
      }
      custom_code {
        css
        head_html
        body_html
        scripts {
          src
          content
          strategy
        }
      }
      sections {
        id
        type
        order
        hidden
        layout {
          width
          padding
          columns
          alignment
          min_height
          background {
            type
            value
          }
        }
        props
        data_binding {
          mode
          source {
            type
            field
          }
          overrides
        }
        craft_node_id
        children {
          id
          type
          order
          hidden
          layout {
            width
            padding
            columns
            alignment
            min_height
            background {
              type
              value
            }
          }
          props
          data_binding {
            mode
            source {
              type
              field
            }
            overrides
          }
          craft_node_id
          children {
            id
            type
            order
            hidden
            layout {
              width
              padding
              columns
              alignment
              min_height
              background {
                type
                value
              }
            }
            props
            data_binding {
              mode
              source {
                type
                field
              }
              overrides
            }
            craft_node_id
            children {
              id
              type
              order
              hidden
              layout {
                width
                padding
                columns
                alignment
                min_height
                background {
                  type
                  value
                }
              }
              props
              data_binding {
                mode
                source {
                  type
                  field
                }
                overrides
              }
              craft_node_id
              children {
                id
                type
                order
                hidden
                layout {
                  width
                  padding
                  columns
                  alignment
                  min_height
                  background {
                    type
                    value
                  }
                }
                props
                data_binding {
                  mode
                  source {
                    type
                    field
                  }
                  overrides
                }
                craft_node_id
              }
            }
          }
        }
      }
    }
  }
` as TypedDocumentNode<GetPageConfigWithCustomCodeQuery, GetPageConfigWithCustomCodeQueryVariables>;
