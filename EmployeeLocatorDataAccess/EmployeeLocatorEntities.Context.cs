﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EmployeeLocatorDataAccess
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class FloorWalkerEntities : DbContext
    {
        public FloorWalkerEntities()
            : base("name=FloorWalkerEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<Designation> Designations { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EmpPosition> EmpPositions { get; set; }
        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<Phase> Phases { get; set; }
        public virtual DbSet<Position> Positions { get; set; }
        public virtual DbSet<PositionType> PositionTypes { get; set; }
        public virtual DbSet<Path> Paths { get; set; }
    
        public virtual ObjectResult<FindPersonOrLoc_Result> FindPersonOrLoc(string searchText)
        {
            var searchTextParameter = searchText != null ?
                new ObjectParameter("SearchText", searchText) :
                new ObjectParameter("SearchText", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<FindPersonOrLoc_Result>("FindPersonOrLoc", searchTextParameter);
        }
    
        public virtual ObjectResult<GetAvailablePlaces_Result> GetAvailablePlaces()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GetAvailablePlaces_Result>("GetAvailablePlaces");
        }
    
        public virtual ObjectResult<GetEmpDetails_Result> GetEmpDetails(Nullable<int> empID)
        {
            var empIDParameter = empID.HasValue ?
                new ObjectParameter("EmpID", empID) :
                new ObjectParameter("EmpID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GetEmpDetails_Result>("GetEmpDetails", empIDParameter);
        }
    }
}
