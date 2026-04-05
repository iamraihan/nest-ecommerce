import { Prisma } from '@prisma/client';

export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    $allModels: {
      async findMany({ model, args, query }) {
        const fields = Prisma.dmmf.datamodel.models.find(
          (m) => m.name === model,
        )?.fields;

        const hasStatus = fields?.some((f) => f.name === 'status');
        if (hasStatus && !args.where?.status) {
          args.where = { ...args.where, status: { not: 'DELETED' } };
        }

        return query(args);
      },

      async findFirst({ model, args, query }) {
        const fields = Prisma.dmmf.datamodel.models.find(
          (m) => m.name === model,
        )?.fields;

        const hasStatus = fields?.some((f) => f.name === 'status');
        if (hasStatus && !args.where?.status) {
          args.where = { ...args.where, status: { not: 'DELETED' } };
        }

        return query(args);
      },
    },
  },
});
