using System;

namespace EmployeeLocatorDataAccess
{
    public abstract class BaseRepository : IDisposable
    {
        #region Global Variables

        protected FloorWalkerEntities _context;

        #endregion

        #region Constructor

        protected BaseRepository(FloorWalkerEntities context)
        {
            _context = context;
        }

        #endregion

        #region Public Methods

        public void Save()
        {
            _context.SaveChanges();
        }

        #endregion

        #region Dispose

        private bool disposed;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~BaseRepository()
        {
            Dispose(false);
        }

        #endregion
    }
}
