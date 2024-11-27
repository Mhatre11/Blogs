
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Data
{
    public class SqlRepository<T> : IRepository<T> where T : class
    {
        private readonly AppDbContext context;
        /*************  ✨ Codeium Command ⭐  *************/
        /// <summary>
        /// Creates a new instance of the <see cref="SqlRepository{T}"/> class.
        /// </summary>
        /// <param name="context">The database context.</param>
        /******  a61e100e-91c0-4315-bcae-db892eb9d2a4  *******/

        public SqlRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<T> AddAsync(T entity)
        {
            await context.Set<T>().AddAsync(entity);
            await context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            if (entity != null)
            {
                context.Set<T>().Remove(entity);
            }
            await context.SaveChangesAsync();

        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            var entities = await context.Set<T>().ToListAsync();
            return entities;
        }

        public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter)
        {
            var entities = await context.Set<T>().Where(filter).ToListAsync();
            return entities;
        }

        public async Task<T> GetByIdAsync(int id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            return entity ?? throw new InvalidOperationException($"Entity with id {id} not found");
        }

        public async Task<bool> SaveChangesAsync()
        {
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<T> UpdateAsync(T entity)
        {
            context.Set<T>().Update(entity);
            await context.SaveChangesAsync();
            return entity;
        }


    }
}